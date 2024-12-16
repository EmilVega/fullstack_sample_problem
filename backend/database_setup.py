from flask import Flask
from models import db, User, Iris
import pandas as pd

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///iris.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Function to create tables and load data
def setup_database():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Create two users
        user1 = User(email='emilvega@test.com', password='password123', role='setosa')
        user2 = User(email='dariogualan@test.com', password='password456', role='virginica')
        
        db.session.add_all([user1, user2])

        # I tryed to use protection for the password using encription but I wasted so much time dealing with the CORS that I dind't have enough time to implemented. 
        # But I know it is important to have. 

        # Load Iris dataset
        df = pd.read_csv('iris.csv')
        for _, row in df.iterrows():
            iris_entry = Iris(
                sepal_length=row['sepal.length'],
                sepal_width=row['sepal.width'],
                petal_length=row['petal.length'],
                petal_width=row['petal.width'],
                variety=row['variety']
            )
            db.session.add(iris_entry)
        
        db.session.commit()
        print("Database setup complete!")

if __name__ == '__main__':
    setup_database()
