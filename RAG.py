from groq import Groq
from dotenv import load_dotenv
# from langchain.document_loaders import PyPDFLoader, UnstructuredPDFLoader
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io
import os 
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document
from retriever import KnowledgeBase
from rag_helpers import load_from_pickle, read_pdf_no_ocr

load_dotenv()

def ocr_pdf(file_path):
    doc = fitz.open(file_path)
    all_text = []

    for page in doc:
        pix = page.get_pixmap(dpi=300)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        text = pytesseract.image_to_string(img)
        all_text.append(text)
    
    return "\n".join(all_text)

print(type(read_pdf_no_ocr("The herbal handbook for home and health 501 recipes 2015.pdf")))
kb = KnowledgeBase(collection_name="herbal_books_chunks")
kb.add_document_to_db("The herbal handbook for home and health 501 recipes 2015.pdf", read_pdf_no_ocr, "The herbal handbook for home and health 501 recipes")
kb.add_document_to_db("Medical_Herbalism_TesseractOCR_output.pkl", load_from_pickle, "Medical Herbalism")

# for k, v in kb.query_similar_chunks("Headache").items():
#     print(k, v)


# client = Groq(
#     api_key=os.environ.get("GROQ_API_KEY"),
# )


llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)






def AI_respond(human_prompt: str, kb: KnowledgeBase, history: list = None, top_k: int = 3,):
    """
    RAG-based response system.
    
    Args:
        human_prompt: The user's question.
        kb: Your KnowledgeBase instance.
        top_k: How many chunks to retrieve.

    Returns:
        The AI's response string.
    """

    system_message = """
                        You are a helpful RAG System that Recommends Herbs and general health advices.
                        Answer based only on the provided context chunks: {retrieved_chunks}.
                        Important: If the user's conditions make a herb or recommendation risky, kindly mention it.
                        If you don't find the answer in the context, say "I don't know based on the given information."
                    """
    prompt = ChatPromptTemplate.from_messages(
        [
            ("human", "{human_question}"),
        ]
    )


    full_chat = [("system", system_message)]

    for past_human, past_ai in history:
        full_chat.append(("human", past_human))
        full_chat.append(("ai", past_ai))

    # Add the new incoming human question
    full_chat.append(("human", "{human_question}"))

    # Create ChatPromptTemplate
    prompt = ChatPromptTemplate.from_messages(full_chat)

    # Retrieve top-k similar chunks
    results = kb.query_similar_chunks(human_prompt, n_results=top_k)

    # Combine retrieved context
    chunks_texts = []
    for metadata in results["metadatas"][0]:
        chunks_texts.append(metadata["content"])

    combined_chunks = "\n\n".join(chunks_texts)

    # Build the chain and invoke
    chain = prompt | llm

    response = chain.invoke(
        {
            "retrieved_chunks": combined_chunks,
            "human_question": human_prompt,
        }
    )

    return response.content

history = []
human_question = "What are good herbs for anxiety?"


print(AI_respond(human_prompt=human_question, kb=kb, history=history))