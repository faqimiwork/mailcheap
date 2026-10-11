// Shared by the live OG endpoint and the offline design preview.
export default function ShareCard({ name, title, description, logo, domain, footer = "", issue = false }) {
	return (
		<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "48px 60px", backgroundColor: "#f4cf4e", fontFamily: "Geist", color: "#202622" }}>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 24, borderBottom: "1px solid #c5a437" }}>
				<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
					<div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#527963" }} />
					<span style={{ fontSize: 20, letterSpacing: 2, fontWeight: 600 }}>{issue ? name : "THE NEWSLETTER"}</span>
				</div>
				<span style={{ fontSize: 20, color: "#4a4c36" }}>{domain}</span>
			</div>
			<div style={{ display: "flex", flex: 1, alignItems: "center", gap: 40 }}>
				<div style={{ display: "flex", flexDirection: "column", gap: 24, width: logo ? 710 : 1040 }}>
					<span style={{ fontSize: issue ? 62 : 82, fontFamily: "Editorial", fontStyle: "italic", fontWeight: 700, letterSpacing: -3, lineHeight: 1.1 }}>{title}</span>
					{description && (
						<div style={{ display: "flex", flexWrap: "wrap", fontSize: 29, lineHeight: 1.4, color: "#414735", maxWidth: 660 }}>
							{description.split(/\s+/).map((word, index) => <span key={index} style={{ marginRight: 7, fontWeight: /^EdTech[.,!?]?$/i.test(word) ? 600 : 400 }}>{word}</span>)}
						</div>
					)}
				</div>
				{logo && (
					<div style={{ display: "flex", width: 290, height: 320, position: "relative", alignItems: "center", justifyContent: "center" }}>
						<div style={{ display: "flex", position: "absolute", width: 278, height: 278, backgroundColor: "#dfb93c", borderRadius: 139, top: 25, left: 10 }} />
						<div style={{ display: "flex", padding: 12, backgroundColor: "#ffffff", borderRadius: 52, transform: "rotate(-6deg)", boxShadow: "0 12px 24px rgba(30,45,30,0.12)" }}>
							{/* eslint-disable-next-line @next/next/no-img-element -- Rendered by ImageResponse. */}
							<img src={logo} alt="" width={230} height={230} style={{ borderRadius: 42 }} />
						</div>
					</div>
				)}
			</div>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 22, borderTop: "1px solid #c5a437", fontSize: 21, color: "#4a4c36" }}>
				<span>{footer || "Ideas. Experiments. Perspective."}</span>
				<div style={{ display: "flex", alignItems: "center", gap: 12, color: "#202622", fontWeight: 600 }}><span>Read the newsletter</span><span>↗</span></div>
			</div>
		</div>
	);
}
