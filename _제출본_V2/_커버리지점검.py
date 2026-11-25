# -*- coding: utf-8 -*-
"""문서가 다루는 화면이 프로토타입에 다 있는지 대조.

  실행: python -I _커버리지점검.py
  문서의 장·절 하나하나를 프로토타입 상태에 매핑해 두고,
  매핑이 비어 있으면 '프로토타입에 화면 없음'으로 보고한다.
  새 절을 문서에 추가하면 여기도 한 줄 추가해야 한다 — 그래야 누락이 드러난다.
"""
import io, os, re
NL = chr(10)
ROOT = r"C:\Users\oem\Desktop\tethermax_project\DEX"
DOC = os.path.join(ROOT, "_제출본_V2", "2_화면_수정_필요", "화면_수정_필요_목록_국문.md")
PROTO_U = os.path.join(ROOT, "_프로토타입", "사용자화면_DEX영향도.html")
PROTO_B = os.path.join(ROOT, "_프로토타입", "백오피스_DEX영향도.html")

# 문서 장 → 프로토타입 상태 (빈 리스트 = 화면 불필요, 사유를 함께 적는다)
MAP = {
    "1":    ([], "전역 용어·칩·자릿수 — 특정 화면이 아님"),
    "2":    (["hub/H1-CEX", "hub/H1-DEX", "hub/H5", "hub/H6"], ""),
    "3":    (["lnd/LND1", "lnd/LND2"], ""),
    "4":    (["exd/D1", "exd/D2"], ""),
    "5":    (["home/S4", "home/EXP", "home/LKD"], ""),
    "6":    (["wd/DW1", "wd/DW0", "wd/DW2", "wd/DW3", "wd/NM"], ""),
    "7":    (["link/L0", "link/L1", "link/L3", "link/L7", "link/L8", "link/L10"], ""),
    "8":    (["link/E4", "wd/NM"], ""),
    "9":    (["rk/RK2", "ph/PH1", "ph/PH2", "ph/PH3", "inv/IF8"], ""),
    "10":   (["bnf/LIST", "bnf/UIDM", "lnd/QZ", "cp/CP1"], ""),
    "11":   (["nw/NW-1", "nw/NW-2", "nw/NW-3", "nw/NW-4"], ""),
    "12":   ([], "2차 마감으로 넘긴 항목"),
    "13":   (["lnd/LND1", "lnd/LND2", "hub/H1-CEX", "hub/H5"], ""),
    "14":   (["link/L0", "link/E4", "etc/FEED", "wd/DW1", "hist/CS3", "etc/EVT"], ""),
    "15":   ([], "담당 구분표"),
    "16":   (["wd/DW1", "home/EXP", "rk/RK2", "hub/H5", "hist/CS3",
              "bnf/LIST", "own/O1", "etc/BST", "ch/CH1", "ch/CH2", "cp/CP1"], ""),
}


def proto_states():
    ids = set()
    for p, pre in [(PROTO_U, ""), (PROTO_B, "")]:
        s = io.open(p, encoding="utf-8").read()
        for m in re.finditer(r'\{id:"([a-z]{2,5})",\s*en:"[^"]*",\s*ko:"[^"]*",(?:\s*dot:"[a-z]",)?\s*states:\[', s):
            g = m.group(1)
            seg = s[m.end():]
            # 다음 그룹 전까지
            nxt = re.search(r'\{id:"[a-z]{2,5}",\s*en:"[^"]*",\s*ko:"[^"]*",(?:\s*dot:"[a-z]",)?\s*states:\[', seg)
            seg = seg[:nxt.start()] if nxt else seg
            for sm in re.finditer(r'\{id:"([A-Za-z0-9_-]+)",en:', seg):
                ids.add(g + "/" + sm.group(1))
    return ids


# 어드민 문서(08_어드민_화면별) 장 → 백오피스 상태
MAP_B = {
    "2":     (["mb/MB-1", "mb/MB-4"], ""),
    "3":     (["pa/MB-3", "pa/MB-5"], ""),
    "4":     (["pa/MB-2"], ""),
    "5":     (["ac/AC-1"], ""),
    "6":     (["ac/AC-2"], ""),
    "7":     (["ac/AC-2"], ""),
    "8":     (["pb/PB-1"], ""),
    "9":     (["ex/EX-1", "ex/EX-2", "ex/EX-7"], ""),
    "10":    (["ex/EX-4"], ""),
    "11":    (["ex/EX-5"], ""),
    "12":    (["ex/EX-6"], ""),
    "13":    (["ex/EX-3", "ex/EX-6"], ""),
    "13-9":  (["sd/SD-1", "sd/SD-2"], ""),
    "13-10": (["sd/SD-3", "cp/CP-1"], ""),
    "13-11": (["pt/PT-1", "iv/IV-1", "lg/LG-1", "bd/LG-2", "ac/AC-3"], ""),
}

have = proto_states()
buf = ["프로토타입 상태 " + str(len(have)) + "개", ""]
bad = 0
for ch in sorted(MAP, key=lambda x: int(x)):
    want, why = MAP[ch]
    if not want:
        buf.append("—  %-3s  화면 불필요 — %s" % (ch + "장", why))
        continue
    miss = [w for w in want if w not in have]
    if miss:
        bad += 1
        buf.append("!! %-3s  프로토타입에 없음: %s" % (ch + "장", ", ".join(miss)))
    else:
        buf.append("OK %-3s  %d개 매핑" % (ch + "장", len(want)))

buf.append("")
buf.append("── 어드민 문서 (08_어드민_화면별) ──")
for ch in MAP_B:
    want, why = MAP_B[ch]
    miss = [w for w in want if w not in have]
    if miss:
        bad += 1
        buf.append("!! %-6s 프로토타입에 없음: %s" % (ch + "장", ", ".join(miss)))
    else:
        buf.append("OK %-6s %d개 매핑" % (ch + "장", len(want)))

mapped = set()
for want, _ in list(MAP.values()) + list(MAP_B.values()):
    mapped |= set(want)
orphan = sorted(have - mapped)
buf.append("")
buf.append("문서 장에 매핑되지 않은 상태 " + str(len(orphan)) + "개")
for o in orphan:
    buf.append("   · " + o)
buf.append("")
buf.append("문제 " + str(bad) + "장")
io.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "_커버리지점검.txt"),
        "w", encoding="utf-8").write(NL.join(buf))
print("done", bad)
