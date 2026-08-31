"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  MoreHorizontal, ThumbsUp, MessageSquare, Share2,
  Bookmark, Send, CheckCircle2, CornerDownRight,
} from "lucide-react";
import { ReactionPopover, ReactionType, REACTION_CONFIG } from "./ReactionPopover";
import { apiRequest, resolveImageUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Comment {
  _id: string;
  content: string;
  author: { firstName: string; lastName: string; profilePicture?: string; username?: string };
  repliesCount: number;
  createdAt: string;
  replies?: Comment[];
  showReplies?: boolean;
  loadingReplies?: boolean;
  replyText?: string;
  showReplyInput?: boolean;
}

export interface PostCardProps {
  post: {
    _id: string;
    author: {
      _id: string;
      firstName: string;
      lastName: string;
      username: string;
      profilePicture?: string;
      isVerified?: boolean;
    };
    content: string;
    image?: string;
    images?: string[];
    video?: string;
    link?: string;
    likesCount?: number;
    reactionsCount?: Record<string, number>;
    commentsCount?: number;
    sharesCount?: number;
    createdAt: string;
    originalPost?: any;
    shareComment?: string;
  };
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(null);
  const [reactionsCount, setReactionsCount] = useState<number>(post.likesCount || 0);
  const [showReactionsPopover, setShowReactionsPopover] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const popoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterPopover = () => {
    if (popoverTimeoutRef.current) clearTimeout(popoverTimeoutRef.current);
    setShowReactionsPopover(true);
  };

  const handleMouseLeavePopover = () => {
    if (popoverTimeoutRef.current) clearTimeout(popoverTimeoutRef.current);
    popoverTimeoutRef.current = setTimeout(() => setShowReactionsPopover(false), 450);
  };

  const handleReact = async (type: ReactionType) => {
    if (popoverTimeoutRef.current) clearTimeout(popoverTimeoutRef.current);
    setShowReactionsPopover(false);
    const isToggleOff = currentReaction === type;
    if (isToggleOff) {
      setCurrentReaction(null);
      setReactionsCount((prev) => Math.max(0, prev - 1));
    } else {
      if (!currentReaction) setReactionsCount((prev) => prev + 1);
      setCurrentReaction(type);
    }
    try {
      await apiRequest(`/posts/${post._id}/react`, { method: "PUT", body: { type: isToggleOff ? null : type } });
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    try {
      if (saved) {
        await apiRequest(`/posts/${post._id}/save`, { method: "DELETE" });
        setSaved(false);
      } else {
        await apiRequest(`/posts/${post._id}/save`, { method: "POST" });
        setSaved(true);
      }
    } catch (err) { console.error(err); }
  };

  const loadComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      try {
        const res = await apiRequest(`/comments/post/${post._id}`);
        if (res.success && res.data) {
          setComments(res.data.map((c: Comment) => ({ ...c, replies: [], showReplies: false, showReplyInput: false, replyText: "" })));
        }
      } catch (err) { console.error(err); }
      finally { setLoadingComments(false); }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await apiRequest(`/comments/${post._id}`, { method: "POST", body: { content: commentText, parentComment: null } });
      if (res.success && res.comment) {
        setComments((prev) => [{ ...res.comment, replies: [], repliesCount: 0 }, ...prev]);
        setCommentText("");
      }
    } catch (err) { console.error(err); }
  };

  const handleAddReply = async (commentId: string) => {
    const comment = comments.find((c) => c._id === commentId);
    if (!comment?.replyText?.trim()) return;
    try {
      const res = await apiRequest(`/comments/${post._id}`, { method: "POST", body: { content: comment.replyText, parentComment: commentId } });
      if (res.success && res.comment) {
        setComments((prev) => prev.map((c) =>
          c._id === commentId
            ? { ...c, repliesCount: c.repliesCount + 1, replies: [...(c.replies || []), res.comment], showReplies: true, replyText: "", showReplyInput: false }
            : c
        ));
      }
    } catch (err) { console.error(err); }
  };

  const loadReplies = async (commentId: string) => {
    const comment = comments.find((c) => c._id === commentId);
    if (!comment) return;
    if (comment.showReplies) {
      setComments((prev) => prev.map((c) => c._id === commentId ? { ...c, showReplies: false } : c));
      return;
    }
    setComments((prev) => prev.map((c) => c._id === commentId ? { ...c, loadingReplies: true } : c));
    try {
      const res = await apiRequest(`/comments/post/${post._id}?parentComment=${commentId}`);
      setComments((prev) => prev.map((c) =>
        c._id === commentId ? { ...c, replies: res.data || [], showReplies: true, loadingReplies: false } : c
      ));
    } catch {
      setComments((prev) => prev.map((c) => c._id === commentId ? { ...c, loadingReplies: false } : c));
    }
  };

  const toggleReplyInput = (commentId: string) => {
    setComments((prev) => prev.map((c) => c._id === commentId ? { ...c, showReplyInput: !c.showReplyInput, replyText: "" } : c));
  };

  const updateReplyText = (commentId: string, text: string) => {
    setComments((prev) => prev.map((c) => c._id === commentId ? { ...c, replyText: text } : c));
  };

  const renderFormattedContent = (text: string) => {
    if (!text) return null;
    return text.split(/(\s+)/).map((part, index) => {
      if (part.startsWith("#"))
        return <span key={index} className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">{part}</span>;
      if (part.startsWith("@"))
        return <span key={index} className="text-purple-600 dark:text-purple-400 font-medium hover:underline cursor-pointer">{part}</span>;
      return part;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 mb-4 transition">

      {/* Author Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author?.username || "user"}`}>
            <img
              src={resolveImageUrl(post.author?.profilePicture) || "https://i.pravatar.cc/150?img=3"}
              alt={post.author?.firstName || "Author"}
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
          </Link>
          <div>
            <div className="flex items-center gap-1">
              <Link href={`/profile/${post.author?.username || "user"}`} className="font-bold text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition">
                {post.author?.firstName} {post.author?.lastName}
              </Link>
              {post.author?.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500" suppressHydrationWarning>
              {new Date(post.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="text-sm text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-line leading-relaxed">
        {renderFormattedContent(post.content)}
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-3 border border-gray-100 dark:border-gray-700 max-h-96">
          <img src={resolveImageUrl(post.image)} alt="Post media" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Post Video */}
      {post.video && (
        <div className="rounded-xl overflow-hidden mb-3 border border-gray-100 dark:border-gray-700">
          <video src={resolveImageUrl(post.video)} controls className="w-full max-h-96" />
        </div>
      )}

      {/* Post Link */}
      {post.link && (
        <a
          href={post.link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-medium hover:opacity-80 transition truncate"
        >
          🔗 <span className="truncate">{post.link}</span>
        </a>
      )}

      {/* Stats Bar */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 py-2 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-1.5">
          <span className="flex -space-x-1">
            <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">👍</span>
            <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">❤️</span>
          </span>
          <span>{reactionsCount}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadComments} className="hover:underline">{post.commentsCount || comments.length} comments</button>
          <span>•</span>
          <span>{post.sharesCount || 0} shares</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between pt-2">
        <div className="relative" onMouseEnter={handleMouseEnterPopover} onMouseLeave={handleMouseLeavePopover}>
          {showReactionsPopover && (
            <ReactionPopover onSelectReaction={handleReact} onMouseEnter={handleMouseEnterPopover} onMouseLeave={handleMouseLeavePopover} />
          )}
          <button
            onMouseEnter={handleMouseEnterPopover}
            onClick={() => handleReact("like")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold transition ${currentReaction ? REACTION_CONFIG[currentReaction].color : "text-gray-600 dark:text-gray-300"}`}
          >
            {currentReaction ? <span className="text-base">{REACTION_CONFIG[currentReaction].emoji}</span> : <ThumbsUp className="w-4 h-4" />}
            <span>{currentReaction ? REACTION_CONFIG[currentReaction].label : "Like"}</span>
          </button>
        </div>

        <button onClick={loadComments} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold transition">
          <MessageSquare className="w-4 h-4" /><span>Comment</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold transition">
          <Share2 className="w-4 h-4" /><span>Share</span>
        </button>

        <button onClick={handleSave} className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition ${saved ? "text-blue-600" : "text-gray-400"}`} title={saved ? "Saved" : "Save post"}>
          <Bookmark className={`w-4 h-4 ${saved ? "fill-blue-600" : ""}`} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50 space-y-3">

          {/* Add Comment */}
          <div className="flex items-center gap-2">
            <img src={resolveImageUrl(user?.profilePicture) || "https://i.pravatar.cc/150?img=3"} alt="Me" className="w-7 h-7 rounded-full object-cover shrink-0" />
            <div className="flex-1 flex items-center bg-gray-50 dark:bg-gray-700/50 rounded-full px-3 py-1.5 border border-gray-200 dark:border-gray-700">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="Write a comment..."
                className="w-full bg-transparent text-xs text-gray-900 dark:text-gray-100 focus:outline-none placeholder-gray-400"
              />
              <button onClick={handleAddComment} className="text-blue-600 hover:text-blue-700 p-1">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Comments List */}
          {loadingComments ? (
            <p className="text-xs text-gray-400 text-center py-2">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-2">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment._id} className="text-xs">
                  <div className="flex gap-2">
                    <img
                      src={resolveImageUrl(comment.author?.profilePicture) || "https://i.pravatar.cc/150?img=3"}
                      alt={comment.author?.firstName || "User"}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-700/40">
                        <span className="font-bold text-gray-900 dark:text-gray-100 block mb-0.5">
                          {comment.author?.firstName} {comment.author?.lastName}
                        </span>
                        <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
                      </div>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-3 mt-1 px-1">
                        <button onClick={() => toggleReplyInput(comment._id)} className="text-gray-400 hover:text-blue-500 font-semibold transition">
                          Reply
                        </button>
                        {comment.repliesCount > 0 && (
                          <button onClick={() => loadReplies(comment._id)} className="flex items-center gap-1 text-blue-500 hover:text-blue-600 font-semibold transition">
                            <CornerDownRight className="w-3 h-3" />
                            {comment.showReplies ? "Hide" : `${comment.repliesCount} ${comment.repliesCount === 1 ? "reply" : "replies"}`}
                          </button>
                        )}
                      </div>

                      {/* Reply Input */}
                      {comment.showReplyInput && (
                        <div className="flex items-center gap-2 mt-2">
                          <img src={resolveImageUrl(user?.profilePicture) || "https://i.pravatar.cc/150?img=3"} alt="Me" className="w-6 h-6 rounded-full object-cover shrink-0" />
                          <div className="flex-1 flex items-center bg-gray-50 dark:bg-gray-700/50 rounded-full px-3 py-1.5 border border-gray-200 dark:border-gray-700">
                            <input
                              type="text"
                              value={comment.replyText || ""}
                              onChange={(e) => updateReplyText(comment._id, e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleAddReply(comment._id)}
                              placeholder={`Reply to ${comment.author?.firstName}...`}
                              autoFocus
                              className="w-full bg-transparent text-xs text-gray-900 dark:text-gray-100 focus:outline-none placeholder-gray-400"
                            />
                            <button onClick={() => handleAddReply(comment._id)} className="text-blue-600 hover:text-blue-700 p-1">
                              <Send className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {comment.showReplies && (
                        <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                          {comment.loadingReplies ? (
                            <p className="text-gray-400 py-1">Loading replies...</p>
                          ) : (
                            (comment.replies || []).map((reply) => (
                              <div key={reply._id} className="flex gap-2">
                                <img
                                  src={resolveImageUrl(reply.author?.profilePicture) || "https://i.pravatar.cc/150?img=3"}
                                  alt={reply.author?.firstName || "User"}
                                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                                />
                                <div className="bg-gray-50 dark:bg-gray-700/40 p-2 rounded-2xl border border-gray-100 dark:border-gray-700/40 flex-1">
                                  <span className="font-bold text-gray-900 dark:text-gray-100 block mb-0.5">
                                    {reply.author?.firstName} {reply.author?.lastName}
                                  </span>
                                  <p className="text-gray-800 dark:text-gray-200">{reply.content}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
