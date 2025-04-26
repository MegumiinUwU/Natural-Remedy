import pickle
import os
from langchain_community.document_loaders import PyPDFLoader

def store_in_pickle(filename, obj):
    if not os.path.exists(filename):
        with open(filename, 'wb') as f:
            pickle.dump(obj, f)
        print(f"{filename} saved.")
    else:
        print(f"{filename} already exists.")

def load_from_pickle(filename):
    if os.path.exists(filename):
        with open(filename, 'rb') as f:
            return pickle.load(f)
    else:
        raise FileNotFoundError(f"{filename} does not exist.")

def read_pdf_no_ocr(path: str):
    loader = PyPDFLoader(path)
    documents = loader.load()
    combined_content = "\n\n".join(doc.page_content for doc in documents)
    return combined_content