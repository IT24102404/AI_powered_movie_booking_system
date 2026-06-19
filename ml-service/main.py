from fastapi import FastAPI
from pymongo import MongoClient
from recommender import (
    build_model,
    build_user_profile,
    get_recommendations
)

app = FastAPI()

# =========================
# MongoDB Connection
# =========================
client = MongoClient("mongodb://localhost:27017")
db = client["movie_db"]

movie_collection = db["movies"]
rating_collection = db["ratings"]

# =========================
# Global variables
# =========================
movies = []
all_ratings = []
vectorizer = None
tfidf_matrix = None


# =========================
# Load ML model on startup
# =========================
@app.on_event("startup")
def startup():

    global movies, all_ratings, vectorizer, tfidf_matrix

    movies = list(movie_collection.find())
    all_ratings = list(rating_collection.find())

    vectorizer, tfidf_matrix = build_model(
        movies,
        all_ratings
    )

    print("🚀 ML Model loaded successfully")


# =========================
# Recommendation API
# =========================
@app.get("/recommend/{user_id}")
def recommend(user_id: str):

    # Get user ratings
    user_ratings = list(
        rating_collection.find({"userId": user_id})
    )

    # Build user profile
    user_vector = build_user_profile(
        user_ratings,
        movies,
        tfidf_matrix
    )

    # Handle cold start (no ratings)
    if user_vector is None:
        return {
            "userId": user_id,
            "count": 0,
            "recommendations": []
        }

    # Get recommendations
    recommendations = get_recommendations(
        user_vector,
        movies,
        tfidf_matrix,
        user_ratings
    )

    return {
        "userId": user_id,
        "count": len(recommendations),
        "recommendations": recommendations
    }