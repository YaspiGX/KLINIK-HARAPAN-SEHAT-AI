import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as MessageSquare, c as CircleAlert, i as Send, n as UserRound, o as LoaderCircle, r as Stethoscope, s as Heart, t as X } from "../_libs/lucide-react.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dh8alitK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function makeId() {
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
var QUICK_PROMPTS = [
	"Saya demam dan pusing sejak kemarin",
	"Bagaimana pola makan sehat?",
	"Anak saya batuk pilek, apa yang harus dilakukan?"
];
function Avatar({ role }) {
	const isDoctor = role === "doctor";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-md ring-2 ring-white " + (isDoctor ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-700"),
		children: isDoctor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-4 w-4" })
	});
}
function MessageBubble({ message, onSend }) {
	const isUser = message.role === "user";
	let mainText = message.content;
	let questions = [];
	let recommendationText = "";
	if (!isUser && message.content.includes("PERTANYAAN LANJUTAN UNTUK MEMASTIKAN:")) {
		const parts = message.content.split("PERTANYAAN LANJUTAN UNTUK MEMASTIKAN:");
		mainText = parts[0].trim();
		const subParts = parts[1].split("⚠️ **REKOMENDASI MEDIS:**");
		questions = subParts[0].split("\n").filter((q) => q.trim().length > 3);
		if (subParts.length > 1) recommendationText = subParts[1].trim();
	} else if (!isUser && message.content.includes("⚠️ **REKOMENDASI MEDIS:**")) {
		const parts = message.content.split("⚠️ **REKOMENDASI MEDIS:**");
		mainText = parts[0].trim();
		recommendationText = parts[1].trim();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-end gap-2 my-2 ${isUser ? "justify-end" : "justify-start"}`,
		children: [
			!isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { role: "doctor" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-sm leading-relaxed " + (isUser ? "rounded-br-sm bg-teal-600 text-white font-medium" : "rounded-bl-sm bg-white text-slate-800 border border-slate-200"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: !isUser ? "pr-6" : "",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
							components: {
								p: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `mb-2 last:mb-0 ${isUser ? "text-white" : "text-slate-800"}`,
									...props
								}),
								strong: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: `font-semibold ${isUser ? "text-white" : "text-slate-900"}`,
									...props
								})
							},
							children: mainText
						}),
						questions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 pt-3 border-t border-slate-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-1.5",
								children: questions.map((q, i) => {
									const cleanQ = q.replace(/^[\d\.\-\*]\s*/, "").replace(/\*\*/g, "").trim();
									if (!cleanQ) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => onSend(cleanQ),
										className: "text-left w-full rounded-lg border border-teal-200 bg-teal-50/60 px-3 py-2 text-xs font-medium text-teal-800 transition hover:bg-teal-100",
										children: cleanQ
									}, i);
								})
							})
						}),
						recommendationText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] font-bold text-amber-700 mb-0.5 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3" }), " REKOMENDASI MEDIS"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-amber-900 leading-relaxed",
								children: recommendationText
							})]
						})
					]
				})
			}),
			isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { role: "user" })
		]
	});
}
function Index() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [messages, setMessages] = (0, import_react.useState)([{
		id: makeId(),
		role: "doctor",
		content: "Halo! Ada yang bisa saya bantu terkait keluhan kesehatan Anda hari ini? 👋"
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const scrollRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (isOpen) scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [
		messages,
		loading,
		isOpen
	]);
	async function sendMessage(text) {
		if (!text || loading) return;
		const userMsg = {
			id: makeId(),
			role: "user",
			content: text
		};
		const updated = [...messages, userMsg];
		setMessages(updated);
		setInput("");
		setLoading(true);
		try {
			const res = await fetch("https://klinik-harapan-sehat-ai-production-3384.up.railway.app/konsultasi", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: updated })
			});
			if (!res.ok) throw new Error("Server sibuk");
			const data = await res.json();
			setMessages([...updated, {
				id: makeId(),
				role: "doctor",
				content: data.pesan
			}]);
		} catch {
			setMessages([...updated, {
				id: makeId(),
				role: "doctor",
				content: "Maaf, gagal terhubung ke server AI."
			}]);
		} finally {
			setLoading(false);
			inputRef.current?.focus();
		}
	}
	function handleSubmit(e) {
		e?.preventDefault();
		sendMessage(input.trim());
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-50 font-sans text-slate-800 relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "bg-white sticky top-0 z-40 border-b border-slate-100 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-teal-600 p-2.5 rounded-xl text-white shadow-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "w-6 h-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-bold text-xl text-teal-800 leading-tight",
							children: "Klinik Harapan Sehat"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-semibold text-teal-600 tracking-wider uppercase",
							children: "Melayani dengan Hati"
						})] })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "bg-teal-900 text-white py-20 px-4 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "py-1 px-3 rounded-full bg-teal-800 text-teal-200 text-xs font-bold tracking-wider mb-4 inline-block",
							children: "LAYANAN KESEHATAN TERPADU"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-4xl font-extrabold mb-4",
							children: "Kesehatan Keluarga Anda Prioritas Kami"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-teal-100 text-sm leading-relaxed",
							children: "Silakan gunakan widget konsultasi AI di pojok kanan bawah untuk bertanya seputar keluhan medis atau konsultasi cepat secara instan."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-6 right-6 z-50",
				children: [isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 w-[360px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-teal-700 text-white p-4 flex items-center justify-between shrink-0 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center border border-teal-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
										className: "h-4 w-4 text-white",
										fill: "currentColor"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm leading-tight",
									children: "Asisten Klinik AI"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-teal-200 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }), " Online siap membantu"]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsOpen(false),
								className: "text-teal-200 hover:text-white p-1 rounded-lg transition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: scrollRef,
							className: "flex-1 overflow-y-auto p-4 bg-slate-50/50",
							children: [messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, {
								message: m,
								onSend: sendMessage
							}, m.id)), loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 my-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { role: "doctor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-teal-600" })
								})]
							})]
						}),
						messages.length <= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto",
							children: QUICK_PROMPTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => sendMessage(p),
								className: "shrink-0 rounded-full border border-teal-200 bg-teal-50/50 px-3 py-1 text-[11px] font-medium text-teal-700 hover:bg-teal-100",
								children: p
							}, p))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								ref: inputRef,
								value: input,
								onChange: (e) => setInput(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSubmit();
									}
								},
								rows: 1,
								placeholder: "Tulis keluhan pasien...",
								className: "flex-1 resize-none bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 max-h-20",
								disabled: loading
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: loading || !input.trim(),
								className: "h-9 w-9 shrink-0 bg-teal-600 text-white rounded-xl flex items-center justify-center hover:bg-teal-700 transition disabled:opacity-50 shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setIsOpen(!isOpen),
					className: "h-14 w-14 rounded-full bg-teal-600 text-white shadow-xl flex items-center justify-center hover:bg-teal-700 transition-all hover:scale-105 relative group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-6 w-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" })]
				})]
			})
		]
	});
}
//#endregion
export { Index as component };
