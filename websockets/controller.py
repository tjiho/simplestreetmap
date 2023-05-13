from sqlalchemy.orm import Session
from model import Place, Plan
from sqlalchemy import delete
from uuid import uuid4

class Controller():
    def __init__(self, database_connection) -> None:
        self.database_connection = database_connection
        self.plan = None
        self.session = Session(self.database_connection)
        pass
    
    def load_plan(self, plan_token):
        plan = self.session.query(Plan).filter(Plan.token == plan_token).one()
        if plan is None:
            raise Exception("Plan not found")
        self.plan = plan
        return plan

    def create_plan(self, name=''):
        token = str(uuid4())
        plan = Plan(name=name, token=token)
        self.session.add(plan)
        self.session.commit()
        self.plan = plan
        return plan

    def add_place(self, place):
        place_object = Place(id=place.id, name=place.name, latitude=place.latitude, longitude=place.longitude)
        self.session.add(place_object)
        self.session.commit()
        pass

    def remove_place(self, place_id):
        place_object = Place(id=place_id)
        self.session.delete(place_object)
        self.session.commit()
        pass

