import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship, backref
from sqlalchemy import ForeignKey

engine = create_engine('mysql://compuser:smellslikesoup@131.104.49.60/comp', echo=True)
Session = sessionmaker(bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = 'User'
    userId = Column(Integer, primary_key=True)
    firstName = Column(String)
    lastName = Column(String)
    password = Column(String)
    bio = Column(String)

    def __repr__(self):
        return "<User(firstName='%s', lastName='%s', password='%s', bio='%s')>" % (self.firstName,
                self.lastName, self.password, self.bio)

class Permission(Base):
    __tablename__ = 'Permission'
    permId = Column(Integer, primary_key=True)
    view = Column(Integer)
    update = Column(Integer)
    score = Column(Integer)

class Competition(Base):
    __tablename__ = 'Competition'
    competitionId = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    location = Column(String)
    participants = Column(String)
    streamUrl = Column(String)
    subject = Column(String)
    visibility = Column(Integer)
    results = Column(String)

    def __repr__(self):
        return '''<Competition(competitionId='%s', name='%s', description='%s', location='%s', participants='%s', 
            streamUrl='%s', subject='%s', visibility='%s', results='%s')>''' % (self.competitionId, self.name,
                    self.location, self.participants, self.streamUrl, self.subject, self.visibility, self.results)

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


    session.commit()

if __name__ == "__main__":
    main()
