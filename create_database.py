# from langchain.document_loaders import DirectoryLoader
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from google.generativeai import configure
from dotenv import load_dotenv
import os
import shutil

# Load environment variables
load_dotenv()

# Configure Google Gemini API
GOOGLE_API_KEY = "AIzaSyAYF31N3CeT8VJbZxCEeBagJDeSvQQt16k"
configure(api_key=GOOGLE_API_KEY)

FAISS_PATH = "faiss_index"
DATA_PATH = "data/books"


def main():
    generate_data_store()


def generate_data_store():
    documents = load_documents()
    chunks = split_text(documents)
    save_to_faiss(chunks)


def load_documents():
    loader = DirectoryLoader(DATA_PATH, glob="*.md")
    documents = loader.load()
    return documents


def split_text(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n## ", "\n### ", "\n- ", "\n\n", "\n", " ", ""],
        length_function=len,
        add_start_index=True,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(chunks)} chunks.")

    # Print first chunk as a sample
    if len(chunks) > 0:
        sample = chunks[0]
        print("\nSample chunk content:")
        print(sample.page_content)
        print("\nSample chunk metadata:")
        print(sample.metadata)

    return chunks


def save_to_faiss(chunks: list[Document]):
    # Clear out the database first.
    if os.path.exists(FAISS_PATH):
        shutil.rmtree(FAISS_PATH)

    # Create embeddings using Gemini
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",  # Gemini's embedding model
        google_api_key=GOOGLE_API_KEY,
        task_type="retrieval_document"  # Specify task type for better embeddings
    )

    # Create a new vector store from the documents
    db = FAISS.from_documents(chunks, embeddings)
    
    # Save the FAISS index
    db.save_local(FAISS_PATH)
    print(f"Saved {len(chunks)} chunks to {FAISS_PATH}.")


if __name__ == "__main__":
    main()
