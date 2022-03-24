import React from "react";
import {
  Typography,
  Box,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";

const ChatMessage = ({ TextMessage, sender, username }) => {
  return (
    <>
      <ListItem
        component={Box}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <ListItemText
          color="primary"
          primary={
            <Typography
              variant="subtitle2"
              component="h5"
              color={username === sender ? "primary" : "secondary"}
            >
              {username === sender ? `${sender} (Ty)` : sender}
            </Typography>
          }
          secondary={
            <Typography component="span" variant="body2" color="textPrimary">
              {TextMessage}
            </Typography>
          }
        />
        <ListItemAvatar style={{ marginLeft: "15px" }}>
          <Avatar></Avatar>
        </ListItemAvatar>
      </ListItem>
    </>
  );
};

export default ChatMessage;
