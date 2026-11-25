"""Checks emitted HTML and route configuration, not a browser or production API."""
import json, re
from pathlib import Path
from html import unescape
from extract_views import View
ROOT=Path(__file__).parent
data={n:json.loads((ROOT/f'{n}.json').read_text(encoding='utf8')) for n in ['user','admin']}
def rec(name,key):return next(r for r in data[name]['records'] if r['key']==key and r['lang']=='ko' and r['sub'] is None)
def visible(name,key):
    parser=View();parser.feed(rec(name,key)['html'])
    return ' '.join(''.join(parser.text).split())
checks=[]
def check(name,ok,actual,expected):checks.append(dict(name=name,result='PASS' if ok else 'FAIL',actual=actual,expected=expected))
v=visible('user','wd/DW1')
total=re.search(r'출금 가능 페이백 ([\d,.]+) USDT',v).group(1)
amounts=[float(x.replace(',','')) for x in re.findall(r'신청 가능한 페이백 ([\d,.]+) USDT',v)]
check('회원 출금 합계',float(total.replace(',',''))==sum(amounts),{'displayed':total,'eligible_rows':amounts},sum(amounts))
g=next(g for g in rec('user','wd/NM')['go'] if g[1]=='출금하기')
check('비회원 출금 경로 격리',g[2]!='wd/DW1',g[2],'비회원 단일 지갑 경로')
v=visible('user','wd/DW0')
check('DEX 매칭 부족액 안내','Lighter 0x7a3F…c51E9 출금 불가 거래소 페이백을 5.00 USDT' in v,v[v.find('Lighter'):v.find('Lighter')+160],'A=0, B=20이면 A 5 추가 시 10 출금 가능')
v=visible('user','hub/H1-DEX')
check('계산기 지급 주체','Lighter 계정으로 지급돼요' not in v,'Lighter 계정으로 지급돼요' if 'Lighter 계정으로 지급돼요' in v else '없음','테더맥스 잔액으로 적립')
v=visible('user','hist/CS3')
check('DEX 챌린지 제외','페이백 챌린지 리워드 Lighter' not in v,'페이백 챌린지 리워드 Lighter' if '페이백 챌린지 리워드 Lighter' in v else '없음','DEX 내역에 챌린지 리워드 없음')
v=visible('user','ph/PH1')
check('DEX 초대 리워드 적용','DEX 지갑은 초대 리워드 대상이 아닙니다' not in v,'DEX 지갑은 초대 리워드 대상이 아닙니다' if 'DEX 지갑은 초대 리워드 대상이 아닙니다' in v else '없음','DEX도 대상')
v=visible('admin','ex/EX-3')
check('DEX 소유확인 가이드 제외',not ('거래소 Lighter' in v and '녹화를 시작한 뒤 지갑 연결을 해제하세요' in v),'Lighter + 녹화 안내','CEX 전용 또는 DEX 선택 시 해당 섹션 비활성')
v=visible('admin','ac/AC-1')
check('DEX 미출금 잔액 의미', '120.00 - 40.00' not in v,'Lighter 누적 120.00 / 남은 - / 받아간 40.00','DEX도 미출금 잔액 표시')
v=visible('admin','pa/MB-2')
check('제휴사 고정 지급 계정 CEX 전용','Lighter ApeX EdgeX Aster' not in v,'DEX 4곳 표시','어드민 Affiliate 지급 계정은 CEX만')
for name,key,phrase in [('user','own/O1','소유권 신청'),('user','ch/CH2','Lighter'),('user','etc/BST','Lighter')]:
    check(f'제외 정책 유지 {key}',phrase not in visible(name,key),'해당 항목 '+('있음' if phrase in visible(name,key) else '없음'),'없음')
check('Standard 차단 없음', '다음' in visible('user','link/L10') and '경고' not in visible('user','link/L10'),'다음 버튼, 경고 없음','연동 허용')
check('일반 쿠폰 DEX 포함','Lighter' in visible('user','cp/CP1'),'Lighter 선택 행','DEX 선택 가능')
check('일반 초대 출금 DEX 포함','Lighter' in visible('user','inv/IF8'),'Lighter 선택 행','DEX 선택 가능')
check('계산기 요율 중복 입력 제거','페이백율' not in visible('admin','nw/NW-1'),'슬라이더 최소·최대만','요율은 거래소 레코드 참조')
check('한도 미결정 유지','?' in visible('admin','nw/NW-4'),'한도 ?','임의 숫자 확정 금지')
summary={'scope':'오프라인 HTML 생성 결과·경로 설정·소스 정합성 검사. 브라우저 클릭/레이아웃 검증 아님.', 'passed':sum(c['result']=='PASS' for c in checks),'failed':sum(c['result']=='FAIL' for c in checks),'checks':checks}
(ROOT/'policy_checks.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(summary,ensure_ascii=False,indent=2))
