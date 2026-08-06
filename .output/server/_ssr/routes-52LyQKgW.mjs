import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { C as ChevronRight, S as CircleAlert, T as Activity, _ as KeyRound, a as ThumbsDown, b as Database, c as Sparkles, d as Server, f as Send, g as LoaderCircle, h as Lock, i as ThumbsUp, l as ShieldPlus, m as MessageSquare, n as Users, o as Stethoscope, p as Search, r as UserRound, s as SquarePen, t as WandSparkles, u as Settings, v as Heart, w as ArrowLeft, x as Clock, y as Download } from "../_libs/lucide-react.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-52LyQKgW.js
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
		className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-md ring-2 ring-white " + (isDoctor ? "bg-gradient-to-br from-teal-500 to-emerald-600 text-white" : "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700"),
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
		className: `flex items-end gap-2 animate-fade-in ${isUser ? "justify-end" : "justify-start"}`,
		children: [
			!isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { role: "doctor" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-[90%] rounded-2xl px-6 py-5 text-sm shadow-sm leading-relaxed transition-all " + (isUser ? "rounded-br-sm bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-medium" : "rounded-bl-sm bg-white text-slate-800 border border-slate-200"),
				children: [!isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute right-4 top-4 flex gap-1.5 z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-600 transition hover:bg-teal-500 hover:text-white",
						title: "Hasil akurat",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-600 transition hover:bg-rose-500 hover:text-white",
						title: "Hasil kurang tepat",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: !isUser ? "pr-16" : "",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
							components: {
								p: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `mb-3 last:mb-0 ${isUser ? "text-white" : "text-slate-800"}`,
									...props
								}),
								h3: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-5 mb-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-teal-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-bold text-slate-900 flex items-center gap-2 mb-1.5",
										...props
									})
								}),
								ul: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3",
									...props
								}),
								li: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "flex items-start gap-1.5 list-none",
									...props
								}),
								strong: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: `font-semibold ${isUser ? "text-white" : "text-slate-900"}`,
									...props
								})
							},
							children: mainText
						}),
						questions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 pt-5 border-t border-slate-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-bold text-teal-700 mb-3 flex items-center gap-1.5 uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Answer guided questions:"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-2.5",
								children: questions.map((q, i) => {
									const cleanQ = q.replace(/^[\d\.\-\*]\s*/, "").replace(/\*\*/g, "").trim();
									if (!cleanQ) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => onSend(cleanQ),
										className: "text-left w-full rounded-xl border border-teal-200 bg-teal-50/40 px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-teal-100 hover:border-teal-400 hover:shadow-sm flex items-center justify-between group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pr-4 leading-relaxed",
											children: cleanQ
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-7 w-7 shrink-0 rounded-full bg-teal-200 text-teal-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" })
										})]
									}, i);
								})
							})]
						}),
						recommendationText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-bold text-amber-700 mb-1 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), " REKOMENDASI MEDIS"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-amber-900 leading-relaxed",
								children: recommendationText
							})]
						})
					]
				})]
			}),
			isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { role: "user" })
		]
	});
}
function TypingIndicator() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-end gap-2 animate-fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { role: "doctor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl rounded-bl-sm bg-white border border-slate-100 px-5 py-4 shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.3s]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-teal-500 animate-bounce" })
				]
			})
		})]
	});
}
function Index() {
	const [isPublicLanding, setIsPublicLanding] = (0, import_react.useState)(true);
	const [userRole, setUserRole] = (0, import_react.useState)(null);
	const [pinInput, setPinInput] = (0, import_react.useState)("");
	const [pinError, setPinError] = (0, import_react.useState)(false);
	const [currentView, setCurrentView] = (0, import_react.useState)("dashboard");
	const [history, setHistory] = (0, import_react.useState)([]);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const pesanAwal = {
		id: makeId(),
		role: "doctor",
		content: "Selamat datang di **Klinik Harapan Sehat** 👋\n\nIbu/Bapak Dokter, silakan masukkan keluhan atau gejala pasien untuk memulai analisis rekam medis."
	};
	const [messages, setMessages] = (0, import_react.useState)([pesanAwal]);
	const [input, setInput] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const scrollRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const fetchRiwayat = async () => {
		try {
			const res = await fetch(`/riwayat`);
			if (res.ok) {
				const data = await res.json();
				setHistory(data);
			}
		} catch {
			console.log("Gagal memuat riwayat database.");
		}
	};
	(0, import_react.useEffect)(() => {
		if (userRole) {
			fetchRiwayat();
			if (currentView === "chat") scrollRef.current?.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: "smooth"
			});
		}
	}, [
		messages,
		loading,
		userRole,
		currentView
	]);
	function handleUnlock(e) {
		e.preventDefault();
		if (pinInput === "Pastimudah") {
			setUserRole("doctor");
			setCurrentView("dashboard");
			setPinError(false);
			setPinInput("");
		} else if (pinInput === "qsefthuko;13579") {
			setUserRole("admin");
			setPinError(false);
			setPinInput("");
		} else {
			setPinError(true);
			setPinInput("");
		}
	}
	function handleLogout() {
		setUserRole(null);
		setCurrentView("dashboard");
	}
	function handleEditDescription() {
		const keluhanTerakhir = [...messages].reverse().find((m) => m.role === "user");
		if (keluhanTerakhir) {
			setInput(keluhanTerakhir.content);
			inputRef.current?.focus();
		} else alert("Belum ada keluhan yang bisa diedit.");
	}
	function handleExport() {
		const textToCopy = messages.map((m) => `${m.role === "doctor" ? "🏥 AI Klinik" : "👤 Pasien"}:\n${m.content}`).join("\n\n---\n\n");
		navigator.clipboard.writeText(textToCopy);
		alert("✅ Riwayat konsultasi berhasil disalin!");
	}
	function handlePrint() {
		const printWindow = window.open("", "_blank");
		if (!printWindow) {
			alert("Gagal membuka jendela cetak. Izinkan pop-up pada browser Anda.");
			return;
		}
		const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lembar Rekam Medis - Klinik Harapan Sehat</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; max-width: 800px; margin: auto; }
            .header { text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 15px; margin-bottom: 25px; }
            .header h1 { color: #0d9488; margin: 0; font-size: 24px; }
            .header p { margin: 5px 0 0; color: #666; font-size: 14px; }
            .section { margin-bottom: 20px; }
            .section h3 { font-size: 16px; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
            .chat-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 10px; line-height: 1.5; white-space: pre-wrap; }
            .footer { margin-top: 40px; text-align: right; font-size: 14px; }
            .footer .signature { margin-top: 60px; font-weight: bold; text-decoration: underline; }
            @media print { body { padding: 10px; } button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>KLINIK HARAPAN SEHAT</h1>
            <p>Jl. Kesehatan No. 128, Telepon: (021) 555-8998</p>
            <p><strong>LEMBAR RESMI REKAM MEDIS & DIAGNOSIS AI</strong></p>
          </div>
          <div class="section">
            <h3>Waktu Pemeriksaan:</h3>
            <p>${(/* @__PURE__ */ new Date()).toLocaleString("id-ID", {
			dateStyle: "full",
			timeStyle: "short"
		})}</p>
          </div>
          <div class="section">
            <h3>Riwayat Konsultasi & Hasil Analisis:</h3>
            ${messages.map((m) => `
              <div class="chat-box">
                <strong>${m.role === "doctor" ? "🏥 Dr. Anda (AI Klinik)" : "👤 Pasien"}:</strong><br/>
                ${m.content}
              </div>
            `).join("")}
          </div>
          <div class="footer"><p>Dokter Jaga Pemeriksa,</p><div class="signature">( Dr. Jaga Klinik )</div></div>
          <script>window.onload = function() { window.print(); }<\/script>
        </body>
      </html>
    `;
		printWindow.document.write(htmlContent);
		printWindow.document.close();
	}
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
		setError(null);
		try {
			const res = await fetch(`/konsultasi`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: updated })
			});
			if (!res.ok) throw new Error("Server sedang sibuk");
			const data = await res.json();
			setMessages([...updated, {
				id: makeId(),
				role: "doctor",
				content: data.pesan
			}]);
			fetchRiwayat();
		} catch {
			setError("Gagal menghubungi server. Pastikan API Python sudah menyala.");
		} finally {
			setLoading(false);
			inputRef.current?.focus();
		}
	}
	function handleSubmit(e) {
		e?.preventDefault();
		sendMessage(input.trim());
	}
	const filteredHistory = history.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.date.toLowerCase().includes(searchQuery.toLowerCase()));
	if (isPublicLanding) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-50 font-sans text-slate-800 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between h-20 items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden md:flex gap-8 font-medium text-sm text-slate-600",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#",
										className: "text-teal-600 font-bold",
										children: "Beranda"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#",
										className: "hover:text-teal-600 transition",
										children: "Layanan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#",
										className: "hover:text-teal-600 transition",
										children: "Jadwal Dokter"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setIsPublicLanding(false),
								className: "bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-900 transition shadow-lg flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4" }), " Portal Pegawai"]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative bg-teal-900 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 opacity-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-teal-500 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-emerald-500 blur-3xl" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:w-1/2 z-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block py-1 px-3 rounded-full bg-teal-800/50 text-teal-200 text-xs font-bold tracking-wider mb-6 border border-teal-500/30",
								children: "#1 KLINIK TERBAIK DI KOTA ANDA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6",
								children: ["Kesehatan Keluarga Anda adalah ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-emerald-400",
									children: "Prioritas Kami."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-teal-100 text-lg mb-8 max-w-lg leading-relaxed",
								children: "Fasilitas medis modern dengan tim dokter spesialis berpengalaman. Kami hadir untuk memberikan perawatan komprehensif bagi Anda dan keluarga."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "bg-emerald-500 text-white px-8 py-3.5 rounded-full font-bold hover:bg-emerald-400 transition shadow-lg flex items-center gap-2",
									children: ["Daftar Online ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5" })]
								})
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl shadow-xl border border-slate-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-teal-50 p-3 rounded-full text-teal-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-6 h-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-slate-800",
								children: "Buka 24 Jam"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-500 mt-1",
								children: "Layanan IGD dan Poli Umum siap sedia kapan pun Anda butuhkan."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-teal-50 p-3 rounded-full text-teal-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldPlus, { className: "w-6 h-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-slate-800",
								children: "Fasilitas Modern"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-500 mt-1",
								children: "Didukung alat rekam medis mutakhir berbasis Teknologi AI."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-teal-50 p-3 rounded-full text-teal-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-6 h-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-slate-800",
								children: "Dokter Profesional"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-500 mt-1",
								children: "Ditangani oleh tenaga medis bersertifikat dan berpengalaman."
							})] })]
						})
					]
				})
			})
		]
	});
	if (!userRole) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen items-center justify-center bg-slate-900 px-4 relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setIsPublicLanding(true),
			className: "absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 transition",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5" }), " Kembali ke Web Publik"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-fade-in text-center relative overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-emerald-600" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-inner",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-10 w-10" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-slate-800",
					children: "Login Sistem Klinik"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-slate-500 mb-8",
					children: [
						"Masukkan PIN Keamanan Anda.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"(Gunakan PIN Dokter atau PIN Admin Server)"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleUnlock,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: pinInput,
								onChange: (e) => setPinInput(e.target.value),
								placeholder: "Masukkan PIN",
								className: `w-full rounded-xl border-2 py-4 pl-12 pr-4 text-center text-xl tracking-[0.3em] font-bold text-slate-800 focus:outline-none transition-all ${pinError ? "border-red-400 bg-red-50 focus:border-red-500" : "border-slate-200 bg-slate-50 focus:border-teal-500"}`,
								autoFocus: true
							})]
						}),
						pinError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-red-500 font-medium animate-pulse",
							children: "PIN yang Anda masukkan salah. Coba lagi."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "w-full rounded-xl bg-slate-800 py-4 font-bold text-white shadow-lg transition hover:bg-slate-900 flex items-center justify-center gap-2",
							children: ["Masuk / Buka Kunci ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Harapan Sehat"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "w-3 h-3" }), " Server: Online"]
					})]
				})
			]
		})]
	});
	if (userRole === "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen bg-slate-900 text-slate-200 p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-5xl w-full mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-8 border-b border-slate-700 pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-7 w-7 text-white" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold text-white",
							children: "Admin Server Control"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-400 text-sm",
							children: "Dashboard Pengelolaan Database Klinik Harapan Sehat"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleLogout,
						className: "px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium text-sm flex items-center gap-2 transition-all border border-red-500/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4" }), " Keluar (Log Out)"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-0 right-0 p-4 opacity-10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-24 h-24" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-slate-400 font-medium text-sm mb-1",
									children: "Total Pasien Terdaftar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-4xl font-bold text-white",
									children: history.length
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-emerald-400 text-xs mt-2 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3 h-3" }), " Terhubung dengan SQLite"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-0 right-0 p-4 opacity-10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "w-24 h-24" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-slate-400 font-medium text-sm mb-1",
									children: "Status Server API"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold text-emerald-400 mt-2",
									children: "ONLINE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-slate-500 text-xs mt-2",
									children: "Port: 8000 | Network: Local"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-0 right-0 p-4 opacity-10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-24 h-24" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-slate-400 font-medium text-sm mb-1",
									children: "Pengguna Sistem"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold text-white mt-1",
									children: "2 Role Aktif"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-slate-400 text-xs mt-1",
									children: "• Admin Server"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-slate-400 text-xs",
									children: "• Dokter Pemeriksa"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-4 text-white font-bold pb-4 border-b border-slate-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-5 h-5 text-indigo-400" }), " Log Riwayat Database"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-64 overflow-y-auto pr-2 space-y-2",
						children: history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-500 text-sm italic",
							children: "Belum ada data terekam di database."
						}) : history.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate pr-4 text-sm font-medium text-slate-300",
								children: [
									idx + 1,
									". ",
									item.title
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-slate-500 shrink-0 bg-slate-800 px-2 py-1 rounded",
								children: item.date
							})]
						}, item.id))
					})]
				})
			]
		})
	});
	if (userRole === "doctor" && currentView === "dashboard") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen w-screen items-center justify-center bg-slate-900 p-6 relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl animate-fade-in relative z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 mb-6 border-b border-slate-100 pb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md text-2xl font-bold",
							children: "🏥"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold text-slate-800",
							children: "Klinik Harapan Sehat"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-slate-500",
							children: "Dashboard Utama Ruang Dokter"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-4",
						children: "PILIH MENU OPERASIONAL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setMessages([pesanAwal]);
								setError(null);
								setInput("");
								setCurrentView("chat");
							},
							className: "text-left p-6 rounded-2xl bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-all flex items-center gap-4 group shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-12 w-12 shrink-0 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform",
								children: "🩺"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-bold text-slate-800 text-base",
								children: "Konsultasi Pasien Baru"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 mt-0.5",
								children: "Buka ruang rekam medis AI & analisis gejala."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setCurrentView("archive"),
							className: "text-left p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center gap-4 shadow-sm group cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-12 w-12 shrink-0 rounded-xl bg-slate-700 text-white flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform",
								children: "📁"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-bold text-slate-800 text-base",
								children: "Database Arsip Pasien"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 mt-0.5",
								children: "Lihat daftar riwayat konsultasi pasien lama."
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
								" Login sebagai: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Dokter Pemeriksa" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleLogout,
							className: "text-red-500 hover:underline font-medium flex items-center gap-1",
							children: ["Kunci Layar ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3 h-3" })]
						})]
					})
				]
			})
		]
	});
	if (userRole === "doctor" && currentView === "archive") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-screen w-screen bg-slate-50 overflow-hidden animate-fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shrink-0 px-6 py-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setCurrentView("dashboard"),
					className: "p-2 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition text-slate-600 flex items-center gap-2 px-4 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Kembali ke Menu"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden sm:block border-l border-slate-300 pl-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-lg font-bold text-slate-800 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-5 h-5 text-slate-500" }), " Arsip Rekam Medis"]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: searchQuery,
					onChange: (e) => setSearchQuery(e.target.value),
					placeholder: "Cari keluhan atau tanggal pasien...",
					className: "w-full rounded-full bg-white border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all shadow-sm"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 overflow-y-auto p-6 md:p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-6xl mx-auto",
				children: filteredHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center py-32",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-slate-400 mb-4 shadow-inner",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-10 w-10" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold text-slate-700",
							children: "Tidak ada arsip ditemukan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-slate-500 mt-2",
							children: "Coba gunakan kata kunci pencarian yang lain."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
					children: filteredHistory.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group cursor-default flex flex-col justify-between min-h-[160px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md",
								children: item.date
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-slate-800 text-sm line-clamp-3 mb-2 leading-relaxed",
							children: item.title
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-4 pt-3 border-t border-slate-100 w-full justify-between",
							children: ["Lihat Rekam Medis ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
						})]
					}, item.id))
				})
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-screen w-screen bg-slate-50 overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col h-full overflow-hidden bg-gradient-to-br from-teal-50 via-slate-50 to-emerald-50",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full items-center justify-between px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCurrentView("dashboard"),
								className: "p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm",
								title: "Kembali ke Dashboard",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
										className: "h-5 w-5",
										fill: "currentColor"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-base font-bold text-slate-900 leading-tight",
									children: "Konsultasi AI (Pasien Baru)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1 text-xs text-slate-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }), " Klinik Harapan Sehat"]
								})] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleEditDescription,
								className: "flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3.5 w-3.5" }), " Edit deskripsi"]
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					ref: scrollRef,
					className: "flex-1 overflow-y-auto px-4 py-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-4xl flex-col gap-5",
						children: [
							messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, {
								message: m,
								onSend: sendMessage
							}, m.id)),
							loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypingIndicator, {}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700",
								children: error
							}),
							messages.length <= 1 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: QUICK_PROMPTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => sendMessage(p),
									className: "rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-medium text-teal-700 shadow-sm transition-all hover:bg-teal-50 hover:scale-105",
									children: p
								}, p))
							}),
							messages.length > 2 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-col items-center justify-center gap-3 border-t border-slate-200/60 pt-6 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500",
									children: "Hasil diagnosis sudah lengkap?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap justify-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: handlePrint,
											className: "flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-700 shadow-md",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Cetak Rekam Medis"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: handleExport,
											className: "flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Salin Laporan"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => sendMessage("Tolong berikan analisis lanjutan yang lebih mendalam."),
											className: "flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-100 shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-3.5 w-3.5" }), " Analisis Lanjutan"]
										})
									]
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					onSubmit: handleSubmit,
					className: "border-t border-slate-200/60 bg-white/90 backdrop-blur-md px-4 py-4 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-4xl items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
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
								className: "w-full resize-none rounded-2xl bg-transparent px-5 py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none max-h-32",
								placeholder: "Tulis keluhan pasien di sini...",
								disabled: loading
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: loading || !input.trim(),
							className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30 transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-5 w-5" })
						})]
					})
				})
			]
		})
	});
}
//#endregion
export { Index as component };
