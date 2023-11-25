import {
  Avatar,
  Card,
  CardActions,
  CardContent as MuiCardContent,
  CardMedia,
  IconButton,
  Typography,
  Button,
  Badge,
  TextField,
  Stack,
  Chip,
  Collapse,
} from "@mui/material";
import styled from "styled-components";
import { styled as muiStyled } from "@mui/system";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import useAppContext from "../hooks/useAppContextHook";
import { Trash } from "@phosphor-icons/react";
import UserProfileModal from "./UserProfileModal";

const img = "https://1.img-dpreview.com/files/p/TS1200x900~sample_galleries/1330372094/1129645829.jpg";
const img1 = "https://3.img-dpreview.com/files/p/TS1200x900~sample_galleries/1330372094/1693761761.jpg";

const BlogCardContainer = styled.div``;

const CardContainer = muiStyled(Card)({
  borderRadius: "1rem",
  boxShadow: "0px 0px 5px 3px rgba(202, 239, 255, 0.43)",
  padding: "1rem",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  backgroundColor: "whitesmoke",
});

const CardMediaImg = muiStyled(CardMedia)({
  borderRadius: "0.5rem",
});

const CardContent = muiStyled(MuiCardContent)({
  padding: "1rem",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
});

const ProfileIconContainer = styled.div`
  position: relative;
  margin-top: -23px;
  padding-inline: 1rem;
`;

export default function ProjectCard({
  data = {},
  onClickLike = () => {},
  onClickDisLike = () => {},
  onAddComment = () => {},
  username = "",
  onAttachmentDownload = () => {},
  isAdmin = false,
  onApprove = () => {},
  onReject = () => {},
  isEdit = false,
  addComment = true,
  isHome = false,
  isLoggedIn = true,
  requestProject = false,
  onRequestProject = () => {},
  showProjectApprovalRequests = false,
  onApproveProjectRequest = () => {},
  onDelete = () => {},
  onCommentDelete = () => {},
  onReadMore = () => {},
  showUserProfile = false,
}) {
  const [showMore, setShowMore] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showAttachements, setShowAttachements] = useState(false);
  const [commentVal, setCommentVal] = useState("");
  const [userProfileName, setUserProfileName] = useState("");

  const {
    appState: {
      user: { username: userName },
    },
  } = useAppContext();

  const navigate = useNavigate();

  return (
    <BlogCardContainer>
      <CardContainer>
        {/* <CardMediaImg
                component="img"
                height="100"
                image={img}
                alt=""
            /> */}
        {/* <ProfileIconContainer>
                <Avatar src={img1} />
            </ProfileIconContainer> */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data?.sub}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.shortIntro}
          </Typography>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "0.5rem", gap: "0.5rem", cursor: "pointer" }}
            onClick={() => {
              if (showUserProfile) {
                setUserProfileName(data?.crtdBy);
              }
            }}
          >
            <Avatar sx={{ width: 24, height: 24, fontSize: 10 }}>{data?.crtdBy.slice(0, 2).toUpperCase()}</Avatar>
            <Typography variant="caption">{data?.crtdBy}</Typography>
          </div>
          <Collapse in={showMore}>
            <div
              style={{
                marginTop: "1rem",
                paddingTop: "0.5rem",
                borderTop: "0.5px solid gray",
              }}
            >
              <Typography variant="body2" color="text.secondary" whiteSpace="pre-wrap">
                {data?.desc}
              </Typography>
              {data?.attachments?.length > 0 ? (
                <div style={{ marginTop: "1rem" }}>
                  <Typography variant="body2">Attachments</Typography>
                  <div
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {data?.attachments?.map((item) => (
                      <div key={item} style={{ width: "100px", textAlign: "center" }}>
                        <img src={`data:image/png;base64,${item}`} alt={item} style={{ width: "100px", maxHeight: "100px" }} />
                        <Button size="small" variant="outlined" color="primary" style={{}} onClick={() => onAttachmentDownload(item)}>
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </Collapse>
        </CardContent>
        {data?.categories?.length > 0 || (data?.startDate && data?.endDate) ? (
          <CardActions>
            {data?.startDate && data?.endDate && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarMonthIcon fontSize="small" />
                <Typography variant="caption" color="CaptionText" lineHeight={0}>
                  {moment(new Date(data?.startDate)).format("DD MMM YYYY")}
                </Typography>
                <Typography variant="caption" color="CaptionText" lineHeight={0}>
                  -
                </Typography>
                <Typography variant="caption" color="CaptionText" lineHeight={0}>
                  {moment(new Date(data?.endDate)).format("DD MMM YYYY")}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={1}>
              {data?.categories?.map((item) => (
                <Chip key={item} label={item} size="small" variant="filled" color="secondary" />
              ))}
            </Stack>
          </CardActions>
        ) : null}
        <CardActions>
          {!isAdmin && !isHome ? (
            <>
              <IconButton
                aria-label="add to favorites"
                size="small"
                onClick={() => {
                  if (!data?.likes?.includes(username)) {
                    onClickLike();
                  }
                }}
              >
                <Badge badgeContent={data?.likes?.length} color="primary">
                  <ThumbUpIcon {...(data?.likes?.includes(username) ? { color: "primary" } : {})} />
                </Badge>
              </IconButton>
              <IconButton
                aria-label="add to favorites"
                size="small"
                onClick={() => {
                  if (!data?.unlikes?.includes(username)) {
                    onClickDisLike();
                  }
                }}
              >
                <Badge badgeContent={data?.unlikes?.length} color="error">
                  <ThumbDownIcon {...(data?.unlikes?.includes(username) ? { color: "error" } : {})} />
                </Badge>
              </IconButton>
              <IconButton aria-label="share" size="small">
                <ShareIcon />
              </IconButton>
              <IconButton
                aria-label="share"
                size="small"
                onClick={() => {
                  setShowAttachements(false);
                  setShowComments((prevState) => !prevState);
                }}
              >
                <Badge badgeContent={data?.comments && Object.keys(data.comments).length} color="primary">
                  <CommentIcon />
                </Badge>
              </IconButton>
            </>
          ) : null}
          {!isHome && data?.attachments?.length > 0 ? (
            <IconButton
              aria-label="attachments"
              size="small"
              onClick={() => {
                // setShowComments(false)
                // setShowAttachements(prevState => !prevState);
              }}
            >
              <AttachmentIcon />
            </IconButton>
          ) : null}
          <Button
            size="small"
            onClick={() => {
              if (isLoggedIn) {
                setShowMore((prevState) => !prevState);
              } else if (isHome) {
                onReadMore();
              }
            }}
          >
            {showMore ? "Read Less" : "Read More"}
          </Button>
          {requestProject && (
            <Button
              size="small"
              color="secondary"
              onClick={() => {
                onRequestProject(data);
              }}
            >
              Request Project
            </Button>
          )}
          {isEdit && (
            <Button
              size="small"
              onClick={() => {
                navigate("/myprojects/edit", { state: { ...data, type: "edit" } });
              }}
            >
              Edit
            </Button>
          )}
          {isEdit && (
            <Button size="small" onClick={() => onDelete && onDelete(data)} color="error" style={{ marginRight: "1rem" }}>
              Delete
            </Button>
          )}
          {userName === username && isEdit && (
            <div>
              {data?.approved == null && (
                <Typography variant="caption" color="secondary">
                  Pending for Approval
                </Typography>
              )}
              {data?.approved === true && (
                <Typography variant="caption" color="green">
                  Approved
                </Typography>
              )}
              {data?.approved === false && (
                <Typography variant="caption" color="error">
                  Rejected
                </Typography>
              )}
            </div>
          )}
          {isAdmin ? (
            <>
              <Button size="small" onClick={onApprove} variant="contained" color="success">
                Approve
              </Button>
              <Button size="small" onClick={onReject} variant="contained" color="error">
                Reject
              </Button>
            </>
          ) : null}
        </CardActions>
        <Collapse in={showComments}>
          <CardContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                borderTop: "1px solid #e8e8e8",
                paddingTop: "1rem",
              }}
            >
              {Object.keys(data?.comments).map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Stack flexDirection="row" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 10 }}>{item.slice(0, 2).toUpperCase()}</Avatar>
                    <Typography variant="body2">{data?.comments[item] || ""}</Typography>
                  </Stack>
                  {addComment && userName === item ? (
                    <IconButton size="small" color="error" onClick={() => onCommentDelete(item, data.id)}>
                      <Trash />
                    </IconButton>
                  ) : null}
                </div>
              ))}
              {addComment && (
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  style={{ marginTop: "0.5rem" }}
                  placeholder="Your comment here"
                  onChange={(e) => setCommentVal(e.target.value)}
                  value={commentVal}
                  InputProps={{
                    endAdornment: (
                      <Button
                        size="small"
                        onClick={async () => {
                          const isCommentAdded = await onAddComment(data.id, commentVal.trim());
                          if (isCommentAdded) {
                            setCommentVal("");
                          }
                        }}
                      >
                        Comment
                      </Button>
                    ),
                  }}
                />
              )}
            </div>
          </CardContent>
        </Collapse>
        {showProjectApprovalRequests && (
          <CardContent style={{ borderTop: "0.5px solid #dfdfdf", paddingBottom: "0rem" }}>
            <Typography variant="subtitle1">Requested for Project</Typography>
            <div>
              {Object.keys(data?.projectRequests)
                .filter((item) => (data?.projectRequests[item] == false ? true : false))
                .map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "1rem", paddingBlock: "0.2rem" }}>
                    <Typography variant="subtitle2">{item}</Typography>
                    <Button variant="text" size="small" onClick={() => onApproveProjectRequest(item)}>
                      Approve
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        )}
      </CardContainer>
      {userProfileName ? <UserProfileModal userEmail={userProfileName} onClose={() => setUserProfileName("")} /> : null}
    </BlogCardContainer>
  );
}
