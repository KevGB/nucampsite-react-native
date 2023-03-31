import RenderCampsite from "../features/campsites/RenderCampsite";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import { FlatList, Text, View, StyleSheet, Button, Modal } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Input, Rating } from "react-native-elements";
import { postComment } from "../features/comments/commentsSlice";

const CampsiteInfoScreen = ({ route }) => {
  const { campsite } = route.params;
  const comments = useSelector((state) => state.comments);
  const favorites = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  function handleSubmit() {
    const newComment = {
      campsiteId: campsite.id,
      rating,
      author,
      text,
    };
    console.log(newComment);
    dispatch(postComment(newComment));
    setShowModal(!showModal);
  }

  function resetForm() {
    setRating(5);
    setAuthor("");
    setText("");
  }

  const renderCommentItem = ({ item }) => {
    return (
      <View style={styles.commentItem}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        <Rating
          startingValue={item.rating}
          imageSize={10}
          style={{ alignItems: "flex-start", paddingVertical: "5%" }}
          readonly
        />
        <Text style={{ fontSize: 12 }}>{`--${item.author}, ${item.date}`}</Text>
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={comments.commentsArray.filter(
          (comment) => comment.campsiteId === campsite.id
        )}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ marginHorizontal: 20, paddingVertical: 20 }}
        ListHeaderComponent={
          <>
            <RenderCampsite
              campsite={campsite}
              isFavorite={favorites.includes(campsite.id)}
              onShowModal={() => {
                setShowModal(!showModal);
                console.log(showModal);
              }}
              markFavorite={() => dispatch(toggleFavorite(campsite.id))}
            />
            <Text style={styles.commentsTitle}>Comments</Text>
          </>
        }
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
      >
        <View style={styles.modal}>
          <Rating
            showRating
            startingValue={rating}
            imageSize={40}
            onFinishRating={(rating) => setRating(rating)}
            style={{ paddingVertical: 10 }}
          />
          <Input
            placeholder="What's your name?"
            leftIcon="user-o"
            leftIconContainerStyle={{ paddingRight: 10 }}
            onChangeText={(author) => setAuthor(author)}
            value={author}
          />
          <Input
            placeholder="Leave us a comment"
            leftIcon="comment-o"
            leftIconContainerStyle={{ paddingRight: 10 }}
            onChangeText={(comment) => setText(comment)}
            value={text}
          />
          <View style={{ margin: 10 }}>
            <Button
              title="Submit"
              color="#5637dd"
              onPress={() => {
                handleSubmit();
                resetForm();
              }}
            />
          </View>
          <View style={{ margin: 10 }}>
            <Button
              onPress={() => {
                setShowModal(!showModal);
                resetForm();
              }}
              color="#808080"
              title="Cancel"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  commentsTitle: {
    textAlign: "center",
    backgroundColor: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    color: "#43484d",
    padding: 10,
    paddingTop: 30,
  },
  commentItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
});

export default CampsiteInfoScreen;
