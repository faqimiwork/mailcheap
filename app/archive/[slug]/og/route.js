import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import ShareCard from "@/components/ShareCard";
import { countReaders, getArchiveIssue, getArchiveNewsletter } from "@/lib/archive-data";
import { getArchiveUrls } from "@/lib/archive-hosts";
import { getIssueDate } from "@/lib/archive-issues";
import { SHARE_IMAGE_SIZE } from "@/lib/archive-seo";
import { getAppUrl } from "@/lib/config";
import { formatDate, formatNumber } from "@/lib/format";

const [geistRegular, geistSemiBold, editorialBoldItalic] = await Promise.all([
	readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
	readFile(join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf")),
	readFile(join(process.cwd(), "assets/fonts/Lora-BoldItalic.woff")),
]);
const FONTS = [
	{ name: "Geist", data: geistRegular, weight: 400, style: "normal" },
	{ name: "Geist", data: geistSemiBold, weight: 600, style: "normal" },
	{ name: "Editorial", data: editorialBoldItalic, weight: 700, style: "italic" },
];

async function loadImage(url) {
	const buffer = url.startsWith("/")
		? await readFile(join(process.cwd(), "public", url)).catch(() => null)
		: await fetch(url, { signal: AbortSignal.timeout(5000) })
				.then((response) => (response.ok ? response.arrayBuffer() : null))
				.then((data) => data && Buffer.from(data))
				.catch(() => null);
	if (!buffer) return null;
	const type = buffer[0] === 0x89 && buffer[1] === 0x50 ? "png" : buffer[0] === 0xff && buffer[1] === 0xd8 ? "jpeg" : null;
	return type && `data:image/${type};base64,${buffer.toString("base64")}`;
}

// The card renderer can't decode WebP, so a WebP logo uses the PNG saved next to it.
async function readLogo(imageUrl) {
	if (!imageUrl) return null;
	return (await loadImage(imageUrl.replace(/\.webp$/i, ".png"))) ?? loadImage(imageUrl);
}

// Share card for the archive home, and for issues that have no thumbnail of their own.
export async function GET(request, { params }) {
	const { slug } = await params;
	const newsletter = await getArchiveNewsletter(slug);
	if (!newsletter) return new Response("Not found", { status: 404 });

	const postSlug = new URL(request.url).searchParams.get("p");
	const issue = postSlug ? await getArchiveIssue(newsletter._id.toString(), postSlug) : null;
	if (postSlug && !issue) return new Response("Not found", { status: 404 });

	const [logo, readers] = await Promise.all([readLogo(newsletter.imageUrl), countReaders(newsletter._id.toString())]);
	const domain = new URL(getArchiveUrls(newsletter, undefined, getAppUrl()).siteIndex).host;
	const footer = issue ? formatDate(getIssueDate(issue)) : readers >= 100 ? `Join ${formatNumber(readers)} readers` : "";

	return new ImageResponse(
		<ShareCard
			name={newsletter.name}
			title={issue ? issue.subject : newsletter.name}
			description={issue ? issue.previewText : newsletter.description}
			logo={logo}
			domain={domain}
			footer={footer}
			issue={Boolean(issue)}
		/>,
		{
			...SHARE_IMAGE_SIZE,
			fonts: FONTS,
			headers: { "Cache-Control": "private, no-store, max-age=0" },
		}
	);
}
