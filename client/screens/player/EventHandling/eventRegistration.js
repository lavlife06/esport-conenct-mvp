import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Card, Icon, Button } from "react-native-elements";
import Profiles from "../profileHandling/profiles";
import { useDispatch, useSelector } from "react-redux";
import { eventRegistration } from "../../../Redux/actions/event";
import Loading from "../../../shared/loading";
import ConfirmModal from "../../../shared/confirmModal";
import { fetchallEvents } from "../../../Redux/actions/event";
import { CLEAR_PROFILES } from "../../../Redux/actions/types";

const EventRegistration = ({ route, navigation }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { eventdetails, userProfile } = route.params;
  const { searchProfile, loading } = useSelector((state) => ({
    searchProfile: state.profile.profiles,
    loading: state.loading,
  }));

  const [teamMember, setTeamMember] = useState([
    {
      email: userProfile.email,
      name: userProfile.name,
      contact: userProfile.contact,
      username: userProfile.username,
      user: userProfile.user,
      teamLeader: userProfile.username,
    },
  ]);

  const arrayUnique = (arr, uniqueKey) => {
    const flagList = [];
    return arr.filter((item) => {
      if (flagList.indexOf(item[uniqueKey]) === -1) {
        flagList.push(item[uniqueKey]);
        return true;
      }
    });
  };

  const handlingTeamMember = (memberDetail) => {
    if (memberDetail.username === eventdetails.hostedBy) {
      alert("You can't add Host of the Event.");
    } else if (memberDetail.gameIds[eventdetails.game] === "") {
      alert(`${memberDetail.name} has not provided ${eventdetails.game} Id!`);
    } else {
      memberDetail = {
        user: memberDetail.user,
        name: memberDetail.name,
        email: memberDetail.email,
        username: memberDetail.username,
        contact: memberDetail.contact,
      };
      let teamMemberList = [...teamMember, memberDetail];
      if (eventdetails.teamsize >= teamMemberList.length) {
        teamMemberList = arrayUnique(teamMemberList, "username");
        setTeamMember(teamMemberList);
      }
    }
  };

  const removeTeamMember = (username) => {
    const teamMemberAfterRemove = teamMember.filter((item, i) => {
      if (item.username !== username) {
        return true;
      }
    });
    setTeamMember(teamMemberAfterRemove);
  };

  const handleSubmit = () => {
    dispatch(
      eventRegistration({
        registerinfo: {
          teammembersinfo: teamMember,
        },
        eventdetails,
        eventId: eventdetails._id,
        hostId: eventdetails.user,
        teamsize: eventdetails.teamsize,
      })
    );

    if (!loading) {
      navigation.goBack();
      navigation.navigate("Event");
      dispatch({ type: CLEAR_PROFILES });
    }
    setModalOpen(false);
  };

  if (loading) {
    return <Loading />;
  } else {
    return (
      <View>
        <ConfirmModal
          text="Complete Registration!"
          setModalOpen={setModalOpen}
          modalOpen={modalOpen}
          handleOk={handleSubmit}
        />
        <View>
          <FlatList
            data={searchProfile}
            keyboardShouldPersistTaps="always"
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Profiles
                item={[item]}
                adding={true}
                handlingTeamMember={handlingTeamMember}
              />
            )}
          />
        </View>
        <Card containerStyle={styles.card}>
          <Card.Title style={{ color: "#eeeeee" }}>TEAM MEMBERS</Card.Title>
          <View style={styles.cardView}>
            <FlatList
              data={teamMember}
              keyExtractor={(item) => item.user}
              renderItem={({ item }) => (
                <Profiles
                  teamLeader={teamMember[0].username}
                  item={[item]}
                  remove={true}
                  removeTeamMember={removeTeamMember}
                />
              )}
            />
          </View>
          {eventdetails.teamsize === teamMember.length ? (
            <Button
              icon={<Icon name="check" color="#ffffff" />}
              buttonStyle={{
                borderRadius: 5,
                marginTop: 20,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0,
              }}
              onPress={() => setModalOpen(true)}
              title="Submit"
            />
          ) : (
            <></>
          )}
        </Card>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  card: {
    margin: 0,
    borderColor: "#393e46",
    borderWidth: 0,
  },

  cardView: {
    padding: 10,
    margin: 10,
    marginBottom: 5,
    backgroundColor: "#232931",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#666666",
  },
});

export default EventRegistration;
