import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship, backref
from sqlalchemy import ForeignKey
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
import json

engine = create_engine('mysql://compuser:smellslikesoup@131.104.49.60/comp', echo=True)
Session = sessionmaker(bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = 'User'
    userId = Column(Integer, primary_key=True)
    firstName = Column(String)
    lastName = Column(String)
    userName = Column(String)
    password = Column(String)
    bio = Column(String)

    def __repr__(self):
        return "<User(firstName='%s', lastName='%s', password='%s', bio='%s')>" % (self.firstName,
                self.lastName, self.password, self.bio)

class Permission(Base):
    __tablename__ = 'Permission'
    permId = Column(Integer, primary_key=True)
    admin = Column(Integer)
    judge = Column(Integer)
    competitor = Column(Integer)

class Competition(Base):
    __tablename__ = 'Competition'
    competitionId = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    location = Column(String)
    streamUrl = Column(String)
    subject = Column(String)
    public = Column(Integer)
    results = Column(String)
    state = Column(String)

class CompetitionRole(Base):
    __tablename__ = 'CompetitionRole'
    compRoleId = Column(Integer, primary_key=True)
    compId = Column(Integer, ForeignKey('Competition.competitionId'))
    userId = Column(Integer, ForeignKey('User.userId'))
    permId = Column(Integer, ForeignKey('Permission.permId'))

    competition = relationship("Competition", backref=backref('compRoles'))
    user = relationship("User", backref=backref('compRoles'))
    permission = relationship("Permission", backref=backref('compRoles'))

class Stage(Base):
    __tablename__ = 'Stage'
    stageId = Column(Integer, primary_key=True)
    results = Column(String)
    participants = Column(String)
    location = Column(String)
    previousStageId = Column(Integer, ForeignKey('Stage.stageId'))
    nextStageId = Column(Integer, ForeignKey('Stage.stageId'))
    description = Column(String)
    name = Column(String)
    state = Column(String)
    compId = Column(Integer, ForeignKey('Competition.competitionId'))

    nextStage = relationship("Stage", uselist=False, foreign_keys=[previousStageId])
    previousStage = relationship("Stage", uselist=False, foreign_keys=[nextStageId])
    competition = relationship("Competition", backref=backref('stages'))

class StageRole(Base):
    __tablename__ = 'StageRole'
    stageRoleId = Column(Integer, primary_key=True)
    stageId = Column(Integer, ForeignKey('Stage.stageId'))
    userId = Column(Integer, ForeignKey('User.userId'))
    permId = Column(Integer, ForeignKey('Permission.permId'))

    stage = relationship("Stage", backref=backref('stageRoles'))
    user = relationship("User", backref=backref('stageRoles'))
    permission = relationship("Permission", backref=backref('stageRoles'))

class Event(Base):
    __tablename__ = 'Event'
    eventId = Column(Integer, primary_key=True)
    name = Column(String)
    location = Column(String)
    seed = Column(String)
    results = Column(String)
    state = Column(String)
    stageId = Column(Integer, ForeignKey('Stage.stageId'))
    compId = Column(Integer, ForeignKey('Competition.competitionId'))

    stage = relationship("Stage", backref=backref('events'))
    competition = relationship("Competition", backref=backref('events'))

class EventRole(Base):
    __tablename__ = "EventRole"
    eventRoleId = Column(Integer, primary_key=True)
    eventId = Column(Integer, ForeignKey('Event.eventId'))
    userId = Column(Integer, ForeignKey('User.userId'))
    permId = Column(Integer, ForeignKey('Permission.permId'))

    event = relationship("Event", backref=backref('eventRoles'))
    user = relationship('User', backref=backref('eventRoles'))
    permission = relationship("Permission", backref=backref('eventRoles'))

class DatabaseAdapter(object):
    def store_user(self, new_user, session):
        if 'userName' not in new_user or 'password' not in new_user:
            return None
        user = User(userName=new_user['userName'], password=new_user['password'])
        if 'firstName' in new_user:
            user.firstName = new_user['firstName']
        if 'lastName' in new_user:
            user.lastName = new_user['lastName']
        if session.query(User.userId).filter(User.userName == new_user['userName']).count() == 0:
            session.add(user)
            session.commit()
            return user
        else:
            return None

    def store_competition(self, comp_js, creator_id, session):
        if 'name' not in comp_js or 'state' not in comp_js or 'public' not in comp_js:
            return None
        comp = Competition(name=comp_js['name'], state=comp_js['state'], public=comp_js['public'])

        if 'location' in comp_js:
            comp.location = comp_js['location']
        if 'description' in comp_js:
            comp.description = comp_js['description']
        if 'streamUrl' in comp_js:
            comp.streamUrl = comp_js['streamUrl']

        compRole = CompetitionRole()
        user = self.get_user_by_userid(creator_id, session)
        if user is None:
            return None
        permission = Permission(admin=1, judge=0, competitor=0)
        session.add(compRole)
        session.add(user)
        session.add(permission)
        session.add(comp)
        user.compRoles.append(compRole)
        permission.compRoles.append(compRole)
        comp.compRoles.append(compRole)
        session.commit()
        return comp

    def store_stage(self, stage_js, compid, session):
        if 'name' not in stage_js or 'state' not in stage_js:
            return None

        stage = Stage(name = stage_js['name'], state=stage_js['state'])
        session.add(stage)
        if 'location' in stage_js:
            stage.location = stage_js['location']
        if 'description' in stage_js:
            stage.description = stage_js['description']
        if 'nextStage' in stage_js:
            stage.nextStageId = stage_js['nextStage']
        if 'previousStage' in stage_js:
            stage.previousStageId = stage_js['previousStage']
        stage.compId = compid
        session.commit()
        return stage

    def store_event(self, event_js, stageid, compid, session):
        if 'name' not in event_js or 'state' not in event_js:
            return None
        event = Event(name = event_js['name'], state = event_js['state'])
        session.add(event)
        if 'location' in event_js:
            event.location = event_js['location']
        if 'description' in event_js:
            event.description = event_js['description']
        event.compId = compid
        event.stageId = stageid
        session.commit()
        return event

    def get_all_competitions(self, session):
        comps = session.query(Competition).filter(Competition.public == 1).all()
        return comps

    def get_competition_by_compid(self, compid, session):
        try:
            comp = session.query(Competition).filter(Competition.competitionId == compid).one()
            return comp 
        except MultipleResultsFound, e:
            print e
            return None
        except NoResultFound, e:
            print e
            return None

    def get_all_stages_by_compid(self, compid, session):
        try:
            stages = session.query(Stage).filter(Stage.compId == compid).all()
            return stages
        except NoResultFound, e:
            print e
            return None

    def get_stage_by_stageid(self, stageid, session):
        try:
            stage = session.query(Stage).filter(Stage.stageId == stageid).one()
            return stage
        except MultipleResultsFound, e:
            print e
            return None
        except NoResultFound, e:
            print e
            return None

    def get_all_events_by_stageid(self, stageid, session):
        try:
            events = session.query(Event).filter(Event.stageId == stageid).all()
            return events
        except NoResultFound, e:
            print e
            return None

    def get_user_by_userid(self, userid, session):
        try:
            user = session.query(User).filter(User.userId == userid).one()
            return user
        except MultipleResultsFound, e:
            print e
            return None
        except NoResultFound, e:
            print e
            return None

    def get_user_by_username(self, username, session):
        try:
            user = session.query(User).filter(User.userName == username).one()
            return user
        except MultipleResultsFound, e:
            print e
            return None
        except NoResultFound, e:
            print e
            return None

def to_dict(model):
    o = {}
    for col in model._sa_class_manager.mapper.mapped_table.columns:
        o[col.name] = getattr(model, col.name)

    if type(model) is Competition:
        stages = model.stages
        o['stages'] = []
        for stage in stages:
            o['stages'].append(to_dict(stage))
        o['users'] = []
        for role in model.compRoles:
            o['users'].append(to_dict(role))

    if type(model) is Stage:
        events = model.events
        o['events'] = []
        for event in events:
            o['events'].append(to_dict(event))
        o['users'] = []
        for role in model.stageRoles:
            o['users'].append(to_dict(role))

    if type(model) is Event:
        o['users'] = []
        for role in model.eventRoles:
            o['users'].append(to_dict(role))

    for key in o:
        if o[key] is None:
            o[key] = ''
    return o


def main():
    ed_user = User(firstName="Edward", lastName="Paulson", password="smellslikesoup", bio="Hi my name is edward paulson")
    competition = Competition(name="ChickenWing")
    permission = Permission(view=0, update=0, score=0)
    compRole = CompetitionRole()

    session = Session()
    session.add(ed_user)
    session.add(permission)
    session.add(competition)
    session.add(compRole)

    competition.compRoles.append(compRole)
    permission.compRoles.append(compRole)
    ed_user.compRoles.append(compRole)


    #session.commit()

if __name__ == "__main__":
    main()
