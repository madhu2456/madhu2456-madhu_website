import zipfile
import xml.etree.ElementTree as ET

def get_docx_text(path):
    with zipfile.ZipFile(path) as docx:
        xml_content = docx.read('word/document.xml')
        root = ET.fromstring(xml_content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        paragraphs = []
        for paragraph in root.findall('.//w:p', ns):
            texts = []
            for run in paragraph.findall('.//w:t', ns):
                if run.text:
                    texts.append(run.text)
            paragraphs.append("".join(texts))
        return paragraphs

if __name__ == '__main__':
    paragraphs = get_docx_text('Madhu Dadi_Resume.docx')
    for idx in range(35, 55):
        if idx < len(paragraphs):
            print(f"[{idx}]: {paragraphs[idx]}")
