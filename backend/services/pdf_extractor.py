"""
services/pdf_extractor.py
Extracts text from PDF — tries normal text extraction first,
falls back to OCR if the PDF is image-based (e.g. Canva exports).
"""
from pdfminer.high_level import extract_text_to_fp
from pdfminer.layout import LAParams
from io import BytesIO
import re
import fitz  # pymupdf
import pytesseract
from PIL import Image

# ── Windows path to Tesseract ──────────────────────────────────────────────
# Change this if you installed Tesseract somewhere else
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Try pdfminer first. If too little text extracted, fall back to OCR."""
    text = _try_pdfminer(pdf_bytes)

    if len(text.strip()) < 50:
        print("[pdf_extractor] pdfminer returned too little text — trying OCR...")
        text = _try_ocr(pdf_bytes)

    if len(text.strip()) < 10:
        raise ValueError("Could not extract any text from this PDF even with OCR.")

    return _clean_text(text)


def _try_pdfminer(pdf_bytes: bytes) -> str:
    """Standard text-layer extraction."""
    try:
        output = BytesIO()
        extract_text_to_fp(
            BytesIO(pdf_bytes),
            output,
            laparams=LAParams(),
            output_type="text",
            codec="utf-8",
        )
        return output.getvalue().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"[pdf_extractor] pdfminer failed: {e}")
        return ""


def _try_ocr(pdf_bytes: bytes) -> str:
    """
    Render each page as an image at 200 DPI and run Tesseract OCR.
    Works on Canva exports, scanned PDFs, image-only PDFs.
    """
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        pages_text = []

        for page_num in range(len(doc)):
            page = doc[page_num]
            # Render at 200 DPI for good OCR accuracy
            pix = page.get_pixmap(dpi=200)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            page_text = pytesseract.image_to_string(img, lang="eng")
            pages_text.append(page_text)
            print(f"[pdf_extractor] OCR page {page_num + 1}: {len(page_text)} chars extracted")

        return "\n".join(pages_text)

    except Exception as e:
        print(f"[pdf_extractor] OCR failed: {e}")
        return ""


def _clean_text(text: str) -> str:
    """Remove excessive whitespace and non-printable characters."""
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[^\x09\x0A\x0D\x20-\x7E]", " ", text)
    text = re.sub(r" {2,}", " ", text)
    return text.strip()