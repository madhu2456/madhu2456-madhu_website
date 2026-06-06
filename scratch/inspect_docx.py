import zipfile
import xml.etree.ElementTree as ET

def inspect_docx(path):
    with zipfile.ZipFile(path) as docx:
        xml_content = docx.read('word/document.xml')
        root = ET.fromstring(xml_content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        for idx, paragraph in enumerate(root.findall('.//w:p', ns)):
            if idx in [42, 43, 44, 45]:
                texts = []
                for run in paragraph.findall('.//w:t', ns):
                    if run.text:
                        texts.append(run.text)
                text = "".join(texts)
                print(f"Paragraph [{idx}]: {text}")
                for r_idx, run in enumerate(paragraph.findall('.//w:r', ns)):
                    t_nodes = run.findall('.//w:t', ns)
                    for t_node in t_nodes:
                        print(f"  Run {r_idx} text node: '{t_node.text}'")

if __name__ == '__main__':
    inspect_docx('Madhu Dadi_Resume.docx')
