from django.http import JsonResponse
from django.contrib.auth import login, authenticate   # <-- UNCOMMENT (already there)
import logging
import json
from .restapis import get_request, analyze_review_sentiments, post_review
from .restapis import get_request, analyze_review_sentiments
from django.views.decorators.csrf import csrf_exempt
from .models import CarMake, CarModel
from .populate import initiate


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create a `login_user` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provided credential can be authenticated
    user = authenticate(username=username, password=password)
    response_data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        response_data["status"] = "Authenticated"
    else:
        response_data["status"] = "Failed"
    return JsonResponse(response_data)
# ---------- LOGOUT ----------
@csrf_exempt
def logout_user(request):
    username = ""
    if request.user.is_authenticated:
        username = request.user.username
        logout(request)                     # <-- terminate session
    data = {"userName": username}
    return JsonResponse(data)

#---------- REGISTRATION ----------
@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username   = data.get('userName')
    password   = data.get('password')
    first_name = data.get('firstName')
    last_name  = data.get('lastName')
    email      = data.get('email')

    # Check if username already exists
    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Already Registered"})

    # Create new user
    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=first_name,
        last_name=last_name,
        email=email
    )
    login(request, user)   # auto-login after registration
    return JsonResponse({"userName": username, "status": "Authenticated"})


def get_cars(request):
    count = CarMake.objects.count()
    print(f"CarMake count: {count}")
    if count == 0:
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({
            "CarModel": car_model.name,
            "CarMake": car_model.car_make.name
        })
    return JsonResponse({"CarModels": cars})

#Update the `get_dealerships` render list of dealerships all by default, particular state if state is passed
def get_dealerships(request, state="All"):
    if(state == "All"):
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/"+state
    dealerships = get_request(endpoint)
    return JsonResponse({"status":200,"dealers":dealerships})

# -------------------------------------------------
# 2. GET SINGLE DEALER BY ID
# -------------------------------------------------
def get_dealer_details(request, dealer_id):
    if dealer_id:
        endpoint = "/fetchDealer/" + str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})

# -------------------------------------------------
# 3. GET REVIEWS FOR A DEALER + SENTIMENT
# -------------------------------------------------
def get_dealer_reviews(request, dealer_id):
    if dealer_id:
        endpoint = "/fetchReviews/dealer/" + str(dealer_id)
        reviews = get_request(endpoint)
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            # Expected response: {"sentiment": "positive"} or similar
            review_detail['sentiment'] = response.get('sentiment', 'none')
        return JsonResponse({"status": 200, "reviews": reviews})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


# ADD THIS EXACT FUNCTION — COPY-PASTE AT THE END OF views.py
@csrf_exempt
def add_review(request):
    if not request.user.is_authenticated:
        return JsonResponse({"status": 403, "message": "Unauthorized"}, status=403)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            # This function is already in restapis.py — it posts to Cloudant
            result = post_review(data)
            
            if "error" in result:
                return JsonResponse({"status": 500, "message": result["error"]}, status=500)
            
            return JsonResponse({"status": 200, "message": "Review added successfully"})
        except Exception as e:
            return JsonResponse({"status": 500, "message": str(e)}, status=500)
    
    return JsonResponse({"status": 405, "message": "Method not allowed"}, status=405)