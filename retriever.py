import uuid
import chromadb
from langchain_core.documents import Document
from langchain.text_splitter import CharacterTextSplitter
from sentence_transformers import SentenceTransformer

class KnowledgeBase:
    def __init__(self, collection_name: str):
        self.chroma_client = chromadb.PersistentClient(path="./herbal_chunks_VecDB")
        try:
            self.collection = self.chroma_client.get_collection(name=collection_name)
        except:
            self.collection = self.chroma_client.create_collection(name=collection_name)

        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.unique_references = set()

    # This function ensures that the returned object is a langchain_core Document type
    def read_file(self, filename: str, reading_function) -> Document:
        parsed_file = reading_function(filename)
        if not isinstance(parsed_file, Document):
            return Document(page_content=parsed_file)

        return parsed_file

    # this function chunks read documents
    def chunk_document(self, document: Document):
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = text_splitter.split_documents([document])
        return chunks


    def encode_store_chunks(self, chunks, reference_name: str):
        for chunk in chunks:
            chunk_embedding = self.embedding_model.encode(chunk.page_content)
            unique_id = str(uuid.uuid4())
            self.collection.add(
                ids=[unique_id],
                embeddings=[chunk_embedding],
                metadatas=[{
                    "content": chunk.page_content,
                    "reference_name": reference_name
                }]
            )
    
    def add_document_to_db(self, filename: str, reading_function, reference_name: str):
        if reference_name in self.unique_references:
            return
        
        doc: Document = self.read_file(filename, reading_function)
        chunks = self.chunk_document(doc)
        self.encode_store_chunks(chunks, reference_name)
        self.unique_references.add(reference_name)

    def query_similar_chunks(self, query_text: str, n_results: int = 5):
        query_embedding = self.embedding_model.encode(query_text)
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            include=["metadatas", "distances"]
        )
        return results
    
    # TODO: Prevent Developers from storing redundant chunks of the same reference


