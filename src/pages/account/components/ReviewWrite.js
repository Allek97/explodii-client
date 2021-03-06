/* eslint-disable global-require */
import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import HoverRating from "./HoverRating";

import {
    ConfirmationBtn,
    // ExcursionBg,
    ReviewBox,
    TextArea,
    UserNameStyled,
    CloseReview,
    ErrorBox,
} from "../style/ReviewWriteUpdateStyle";

export default function ReviewWrite(props) {
    // props
    const {
        userId,
        userName,
        tourIdReview,
        tourName,
        setIsReviewOpen,
        setIsReviewSuccess,
    } = props;
    // hooks
    const [review, setReview] = useState(null);
    const [rating, setRating] = useState(2);
    const [reviewSize, setReviewSize] = useState(0);
    const [reviewError, setReviewError] = useState(null);
    const [ratingError, setRatingError] = useState(null);

    //

    // const excursionBg =
    //     require("../../../assets/img/tours/tour-1-1.jpg").default;
    const closeBtnSvg = require("../../../assets/svgs/x.svg").default;

    async function handleReviewSubmission() {
        setRatingError("");
        setReviewError("");
        try {
            const body = {
                review: review,
                rating: rating,
                tour: tourIdReview,
                user: userId,
            };
            // NOTE: Mongo for some reasons allow null as number value
            if (rating) {
                const res = await axios.post(
                    `${process.env.REACT_APP_URL}/api/v1/tours/${tourIdReview}/reviews`,
                    body,
                    {
                        withCredentials: true,
                        credentials: "include",
                    }
                );

                // setIsReviewOpen(false);
                if (res.data.status === "success") {
                    window.setTimeout(() => {
                        // setLogStatus(true);
                        setIsReviewOpen(false);
                        setIsReviewSuccess(true);
                    }, 50);
                    window.setTimeout(() => {
                        // setLogStatus(true);
                        setIsReviewSuccess(false);
                    }, 2000);
                }
            } else {
                setRatingError("Review must have a rating!");
            }
        } catch (err) {
            const { message } = err.response.data;

            if (message.includes("Review cannot be empty!")) {
                setReviewError("Your review cannot be empty !");
            } else if (message.includes("Review must have a rating")) {
                setRatingError("Review must have a rating !");
            } else if (message.includes("duplicate key error")) {
                setReviewError(
                    "You already wrote a review for this excursion !"
                );
            } else {
                setReviewError("An error occured. Please try again !");
            }
        }
    }

    return (
        <>
            <ReviewBox>
                {/* <ExcursionBg excursionBg={excursionBg} /> */}
                <CloseReview
                    svg={closeBtnSvg}
                    onClick={() => {
                        setIsReviewOpen(false);
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        padding: "4rem 6rem",
                    }}
                >
                    <h1
                        style={{
                            paddingBottom: "1.5rem",
                            fontSize: "2.2rem",
                            fontWeight: "400",
                            textAlign: "center",
                            textTransform: "uppercase",
                        }}
                    >
                        Share your opinion with us{" "}
                        {/* {`TODO: SUCCESS MESSAGE AFTER SUCCESSFUL TRANSACTION && SUCCESSFUL REVIEW SUBMISSION`} */}
                    </h1>
                    <UserNameStyled style={{ textTransform: "capitalize" }}>
                        {userName}
                    </UserNameStyled>
                    <UserNameStyled
                        style={{
                            marginBottom: "3rem",
                            textTransform: "capitalize",
                        }}
                    >
                        {tourName} excursion
                    </UserNameStyled>
                    <div
                        style={{
                            position: "relative",
                            alignSelf: "flex-start",
                            marginBottom: "1rem",
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            color: "#fff",
                            display: "flex",
                            width: "100%",
                            height: "2rem",
                        }}
                    >
                        <span style={{ marginRight: "auto" }}>
                            Overall rating*
                        </span>
                        {ratingError && <ErrorBox>{ratingError}</ErrorBox>}
                    </div>
                    <HoverRating rating={rating} setRating={setRating} />

                    <div
                        style={{
                            marginTop: "2rem",
                            width: "100%",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                color: "#fff",
                            }}
                        >
                            <div style={{ display: "flex", height: "2rem" }}>
                                <span style={{ marginRight: "1rem" }}>
                                    Write a review*
                                </span>
                                <span style={{ marginRight: "auto" }}>
                                    ({`${reviewSize} / 200`})
                                </span>
                                {reviewError && (
                                    <ErrorBox>{reviewError}</ErrorBox>
                                )}
                            </div>
                        </span>
                        <TextArea
                            name="review"
                            id="review-text"
                            placeholder="Tell us about your experience!"
                            maxLength={200}
                            value={review}
                            onChange={(e) => {
                                setReviewSize(e.target.value.length);
                                setReview(e.target.value);
                            }}
                        />
                    </div>

                    <ConfirmationBtn
                        onClick={() => {
                            handleReviewSubmission();
                        }}
                    >
                        Submit
                    </ConfirmationBtn>
                </div>
            </ReviewBox>
        </>
    );
}

ReviewWrite.propTypes = {
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    tourIdReview: PropTypes.string.isRequired,
    tourName: PropTypes.string.isRequired,
    setIsReviewOpen: PropTypes.func.isRequired,
    setIsReviewSuccess: PropTypes.func.isRequired,
};
