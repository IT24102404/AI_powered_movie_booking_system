from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# =========================
# 1. Create movie text
# =========================
def create_movie_text(movie, reviews):

    review_text = " ".join(
        r.get("comment", "")
        for r in reviews
        if str(r.get("movieId")) == str(movie.get("_id"))
    )

    return (
        movie.get("title", "") + " " +
        movie.get("genre", "") + " " +
        review_text
    )


# =========================
# 2. Build TF-IDF model
# =========================
def build_model(movies, reviews):

    movie_texts = [
        create_movie_text(movie, reviews)
        for movie in movies
    ]

    vectorizer = TfidfVectorizer(stop_words="english")

    tfidf_matrix = vectorizer.fit_transform(movie_texts)

    return vectorizer, tfidf_matrix


# =========================
# 3. Build user profile
# =========================
def build_user_profile(user_ratings, movies, tfidf_matrix):

    liked_indices = []

    movie_id_to_index = {
        str(movie["_id"]): i
        for i, movie in enumerate(movies)
    }

    for r in user_ratings:

        if r.get("rating", 0) >= 4:

            movie_id = str(r.get("movieId"))

            if movie_id in movie_id_to_index:
                liked_indices.append(movie_id_to_index[movie_id])

    if not liked_indices:
        return None

    user_vector = tfidf_matrix[liked_indices].mean(axis=0)

    return user_vector


# =========================
# 4. Recommend movies
# =========================
def get_recommendations(
    user_vector,
    movies,
    tfidf_matrix,
    user_ratings,
    top_n=5
):

    if user_vector is None:
        return []

    scores = cosine_similarity(
        user_vector,
        tfidf_matrix
    ).flatten()

    # already watched movies
    watched_ids = set(
        str(r.get("movieId"))
        for r in user_ratings
    )

    ranked_indices = scores.argsort()[::-1]

    recommendations = []

    for idx in ranked_indices:

        movie = movies[idx]

        if str(movie.get("_id")) not in watched_ids:

            recommendations.append(movie)

        if len(recommendations) == top_n:
            break

    return recommendations