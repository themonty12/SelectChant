import fitz  # PyMuPDF 라이브러리
import re
import os
from PIL import Image
import pytesseract
import io

# Tesseract 경로 지정 (Windows의 경우)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_hymn_info(pdf_path):
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF 파일을 찾을 수 없습니다: {pdf_path}")
    
    doc = fitz.open(pdf_path)
    hymn_list = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # PDF 페이지를 이미지로 변환
        pix = page.get_pixmap(matrix=fitz.Matrix(300/72, 300/72))  # 300 DPI로 변환
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        # 이미지에서 텍스트 추출 (한글 인식)
        text = pytesseract.image_to_string(img, lang='kor')        
        
        # 페이지의 텍스트를 줄 단위로 분리
        lines = text.split('\n')
        hymn_list.append(lines[0])
        
        
        # # 제목과 번호 찾기 (상단 부분만 검사)
        # for line in lines[:5]:  # 처음 5줄만 검사
        #     line = line.strip()
        #     if re.search('[가-힣]', line) and not line.isspace():
        #         # 오른쪽의 번호 찾기
        #         number_match = re.search(r'\s*(\d+)\s*$', line)
        #         if number_match:
        #             number = number_match.group(1)
        #             title = line[:number_match.start()].strip()
        #             hymn_list.append({
        #                 'number': number,
        #                 'title': title,
        #                 'page': page_num + 1
        #             })
        #             break
    
    doc.close()
    return hymn_list

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_path = os.path.join(script_dir, "청소년청년성가집.pdf")
    
    try:
        hymns = extract_hymn_info(pdf_path)
        # 성가 제목 리스트를 파일에 저장
        output_file = os.path.join(script_dir, "성가제목리스트.txt")
        with open(output_file, 'w', encoding='utf-8') as f:
            for hymn in hymns:
                f.write(f"{hymn}\n")
        print(f"성가 제목 리스트가 {output_file}에 저장되었습니다.")
        # 결과 출력
        # for hymn in hymns:
        #     print(f"성가 번호: {hymn['number']}")
        #     print(f"제목: {hymn['title']}")
        #     print(f"페이지: {hymn['page']}")
        #     print("-" * 30)
    
    except FileNotFoundError as e:
        print(f"오류: {e}")
    except Exception as e:
        print(f"처리 중 오류가 발생했습니다: {e}")

if __name__ == "__main__":
    main() 