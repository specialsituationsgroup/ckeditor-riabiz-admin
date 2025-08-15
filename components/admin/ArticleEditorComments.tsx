/*
 * Admin Writing Interface
 * Copyright (C) 2024 RIABiz
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, see <https://www.gnu.org/licenses/>.
 */

import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteComment,
    fetchAdminComments,
    handleComment,
    patchComment,
} from "@/utils/article-helpers";
import type { CommentREST } from "@/interfaces/article";
import { toast } from "react-toastify";
import { Box, Grid } from "@mui/material";
import Image from "next/image";
import { GenericHeading } from "@/custom-styled-components/typography";
import DateTimeChip from "@/components/article/datetime-chip";
import MuiButton from "@mui/material/Button";
import {
    CheckCircleIcon,
    PencilIcon,
    XCircleIcon,
} from "@heroicons/react/solid";
import { commentKeys } from "@/utils/query-key-factory";
import ForumIcon from "@mui/icons-material/Forum";

interface ArticleCommentsProps {
    articlePk: number;
    authToken: string;
    isOffline: boolean;
}

export const ArticleComments = ({
    authToken,
    articlePk,
    isOffline,
}: ArticleCommentsProps) => {
    const queryClient = useQueryClient();
    const { data: commentData } = useQuery(
        commentKeys.list(articlePk.toString(), "1"),
        () =>
            fetchAdminComments({
                authToken,
                articlePk,
            })
    );
    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: commentKeys.list(articlePk.toString(), "1"),
        });
    };
    const comments = commentData?.results ?? [];
    return (
        <Box alignItems="left">
            <MuiButton
                variant="contained"
                color="primary"
                startIcon={<ForumIcon />}
            >
                ({comments.length}) Comments
            </MuiButton>
            <Box>
                <Box pt={1} borderBottom="3px solid #ddd">
                    {comments.map((comment, idx) => (
                        <ArticleComment
                            commentData={comment}
                            key={idx}
                            authToken={authToken}
                            invalidate={invalidate}
                            isOffline={isOffline}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

interface ArticleCommentProps {
    authToken: string;
    commentData: CommentREST;
    invalidate: () => void;
    isOffline: boolean;
}

const ArticleComment = ({
    commentData,
    authToken,
    invalidate,
    isOffline,
}: ArticleCommentProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { comment: commentData.body },
    });
    const [editing, setEditing] = useState(false);
    const patchMutation = useMutation((comment: string) =>
        patchComment({ pk: commentData.pk, body: comment, authToken })
    );

    interface handleProps {
        pk: number;
        approve: boolean;
    }

    const handleMutation = useMutation(({ pk, approve }: handleProps) =>
        handleComment({ pk, approve, authToken })
    );

    const deleteMutation = useMutation((pk: number) =>
        deleteComment({ pk, authToken })
    );
    const handle = async () => {
        const approvedNew = !commentData.approved;
        handleMutation.mutate(
            {
                pk: commentData.pk,
                approve: approvedNew,
            },
            {
                onSuccess: () => {
                    invalidate();
                    toast.success(
                        `Comment successfully ${
                            approvedNew ? "approved" : "unapproved"
                        }`
                    );
                },
            }
        );
    };
    const handleDelete = async () => {
        deleteMutation.mutate(commentData.pk, {
            onSuccess: () => {
                invalidate();
                toast.success("Comment successfully deleted");
            },
        });
    };
    const handleEdit = () => {
        setEditing(true);
    };
    type commentForm = {
        comment: string;
    };
    const doneEditing = async (data: commentForm) => {
        patchMutation.mutate(data.comment, {
            onSuccess: () => {
                invalidate();
                setEditing(false);
            },
        });
    };
    return (
        <Box py={2} px={1} border="3px solid #ddd" borderBottom="0">
            <Grid container spacing={1}>
                <Grid item xs={1}>
                    <Image
                        src={`${commentData.avatar_url}`}
                        alt={commentData.author_name}
                        width={600}
                        height={600}
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                        }}
                    />
                </Grid>
                <Grid item container spacing={1} xs={11}>
                    <Grid item xs={12}>
                        <GenericHeading variant="h4" fontSize="1.2rem">
                            {commentData.author_name}
                        </GenericHeading>
                    </Grid>
                    <Grid item xs={6}>
                        <DateTimeChip datetimeString={commentData.created} />
                    </Grid>
                    {!editing &&
                        (commentData.approved ? (
                            <Grid item xs={3}>
                                <MuiButton
                                    variant="contained"
                                    color="secondary"
                                    disabled={isOffline}
                                    onClick={() => handle()}
                                    startIcon={
                                        <XCircleIcon className="w-5 h-5 mt-1" />
                                    }
                                >
                                    <div className="pl-2 pt-1">Unapprove</div>
                                </MuiButton>
                            </Grid>
                        ) : (
                            <Grid item xs={6}>
                                <div className="flex">
                                    <div className="mr-2">
                                        <MuiButton
                                            variant="contained"
                                            color="primary"
                                            disabled={isOffline}
                                            onClick={() => handle()}
                                            startIcon={
                                                <CheckCircleIcon className="w-5 h-5 mt-1" />
                                            }
                                        >
                                            <div className="pl-2 pt-1">
                                                Approve
                                            </div>
                                        </MuiButton>
                                    </div>
                                    <div className="mr-2">
                                        <MuiButton
                                            variant="contained"
                                            color="success"
                                            disabled={isOffline}
                                            onClick={() => handleEdit()}
                                            startIcon={
                                                <PencilIcon className="w-5 h-5 mt-1" />
                                            }
                                        >
                                            <div className="pl-2 pt-1">
                                                Edit
                                            </div>
                                        </MuiButton>
                                    </div>

                                    <div className="mr-2">
                                        <MuiButton
                                            variant="contained"
                                            color="secondary"
                                            disabled={isOffline}
                                            onClick={() =>
                                                handleDelete()
                                            }
                                            startIcon={
                                                <XCircleIcon className="w-5 h-5 mt-1" />
                                            }
                                        >
                                            <div className="pl-2 pt-1">
                                                Delete
                                            </div>
                                        </MuiButton>
                                    </div>
                                </div>
                            </Grid>
                        ))}
                </Grid>
                <Grid item xs={12}>
                    <>
                        <form>
                            <textarea
                                className="form-textarea form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows={3}
                                disabled={!editing}
                                {...register("comment", {
                                    required: false,
                                })}
                            />
                            {errors.comment?.message && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.comment?.message}
                                </p>
                            )}
                            {editing && (
                                <div className="mt-2">
                                    <button
                                        type="button"
                                        onClick={handleSubmit(doneEditing)}
                                        className={
                                            "mt-5 cursor-pointer rounded-md border border-transparent bg-green-600 px-4 py-2 text-lg font-medium text-white shadow-sm hover:bg-green-700"
                                        }
                                    >
                                        Done
                                    </button>
                                </div>
                            )}
                        </form>
                    </>
                </Grid>
            </Grid>
        </Box>
    );
};
