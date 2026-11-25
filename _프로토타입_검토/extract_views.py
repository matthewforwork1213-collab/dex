import json
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).parent
class View(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack=[]; self.text=[]; self.notes=[]; self.controls=[]; self.current=None
    def handle_starttag(self, tag, attrs):
        a=dict(attrs); classes=set(a.get('class','').split())
        lifted=(bool(classes & {'note','hint'}) and ('data-kind' in a or 'icm' in classes)) or ('c' in classes and 'icm' in classes)
        hidden=(self.stack[-1][1] if self.stack else False) or lifted
        if 'data-kind' in a: self.notes.append((a['data-kind'],a.get('data-ko','')))
        if tag not in {'br','img','input','hr','meta','link','source','wbr'}: self.stack.append((tag,hidden))
        if not hidden and (tag in {'div','tr','li','h2','h3','p','br','button'}):self.text.append('\n')
        if tag in {'input','select','textarea','button'}:self.controls.append({'tag':tag,**a})
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0]==tag:
                self.stack=self.stack[:i];break
    def handle_data(self,data):
        if not self.stack or not self.stack[-1][1]:self.text.append(data+' ')

for name in ['user','admin']:
    data=json.loads((ROOT/f'{name}.json').read_text(encoding='utf8'))
    out=[]
    for record in data['records']:
        if record['lang']!='ko' or record['sub'] is not None:continue
        p=View();p.feed(record['html'])
        lines=[' '.join(s.split()) for s in ''.join(p.text).splitlines()]
        out += ['\n## '+record['key']+' | '+record['page']+' > '+record['title'],record['description'],'\n'.join(s for s in lines if s),'CONTROLS: '+json.dumps(p.controls,ensure_ascii=False),'GO: '+json.dumps(record['go'],ensure_ascii=False),'NEXT: '+str(record['next']),'NOTES: '+' | '.join(k+': '+v[:230] for k,v in p.notes)]
    (ROOT/f'{name}.views.txt').write_text('\n'.join(out),encoding='utf8')
    print(name, [(p['id'],len(p['states'])) for p in data['inventory']])
