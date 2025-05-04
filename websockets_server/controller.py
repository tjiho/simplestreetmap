from sqlalchemy.orm import Session
from model import Place, Plan
from sqlalchemy import delete
from sqlalchemy.orm import sessionmaker
from uuid import uuid4

class Controller():
    def __init__(self, database_connection) -> None:
        self.database_connection = database_connection
        self.plan_id = None
        self.plan_token = None
        # self.session = Session(self.database_connection)
        self.SessionMaker = sessionmaker(self.database_connection, expire_on_commit=False)
        self.user_id = str(uuid4())
        self.can_edit = False
        pass
    
    def close(self):
        #self.session.close()
        pass

    def load_plan(self, plan_token):
        with self.SessionMaker() as session:
            plan = session.query(Plan).filter(Plan.token == plan_token).one()
            if plan is None:
                raise Exception("Plan not found")
            self.plan_id = plan.id
            self.plan_token = plan.token
            self.can_edit = True
            return plan.toJSON()
    
    def load_plan_by_read_token(self, read_token):
        with self.SessionMaker() as session:
            plan = session.query(Plan).filter(Plan.read_token == read_token).one()
            if plan is None:
                raise Exception("Plan not found")
            self.plan_id = plan.id
            self.plan_token = plan.token
            self.can_edit = False
            return plan.toJSON()

    def create_plan(self, name=''):
        token = str(uuid4()) + '_write'
        read_token = str(uuid4()) + '_read'
        plan = Plan(name=name, token=token, read_token=read_token)
        with self.SessionMaker() as session:
            session.add(plan)
            detachedPlan = plan.toJSON()
            session.commit()
            self.plan_id = plan.id
            self.plan_token = plan.token
            self.can_edit = True
            return detachedPlan

    def add_place(self, place):
        annotation_uuid = str(uuid4())
        place_object = Place(
            uuid=annotation_uuid, 
            name=place['name'], 
            lat=place['lat'], 
            lng=place['lng'],
            plan_id=self.plan_id,
            user_id=self.user_id
            #context=place['context']
        )
        with self.SessionMaker() as session:
            session.add(place_object)
            session.commit()
            session.expunge_all()
            return place_object.toJSON()

    def remove_place(self, place_id):
        with self.SessionMaker() as session:
            try:
                place_object = session.query(Place).filter(Place.uuid == place_id).one()
            except Exception as e:
                raise Exception("Place not found")
            session.delete(place_object)
            session.commit()
            session.expunge_all()
        pass

    def add_annotation(self,annotation):
        if self.can_edit == False:
            return None

        if annotation['object_type'] == 'place':
            return self.add_place(annotation)


    def remove_annotation(self,id, object_type):
        if self.can_edit == False:
            return None

        if object_type == 'place':
            return self.remove_place(id)

