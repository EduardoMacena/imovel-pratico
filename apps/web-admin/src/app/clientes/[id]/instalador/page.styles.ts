"use client";

import Link from "next/link";
import styled, { css } from "styled-components";

export const PageContainer = styled.main`
	width: min(1320px, calc(100% - 40px));
	margin: 0 auto;
	padding: ${({ theme }) => theme.spacing.lg} 0
		${({ theme }) => theme.spacing["3xl"]};

	@media (max-width: 720px) {
		width: min(100% - 24px, 1320px);
	}
`;

export const BackLink = styled(Link)`
	display: inline-flex;
	margin-bottom: ${({ theme }) => theme.spacing.md};
	color: ${({ theme }) => theme.colors.secondary};
	font-size: 13px;
	font-weight: 900;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`;

export const Header = styled.header`
	margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const HeaderGrid = styled.div`
	display: grid;
	grid-template-columns: minmax(0, 1fr) 360px;
	gap: ${({ theme }) => theme.spacing.lg};
	align-items: stretch;

	@media (max-width: 980px) {
		grid-template-columns: 1fr;
	}
`;

export const HeaderContent = styled.div`
	min-height: 300px;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: clamp(34px, 4vw, 58px);
	border-radius: 32px;
	background:
		radial-gradient(
			circle at 16% 12%,
			rgba(200, 164, 93, 0.24),
			transparent 30%
		),
		radial-gradient(circle at 88% 12%, rgba(15, 76, 92, 0.32), transparent 34%),
		linear-gradient(135deg, #0b1f33, #071927);
	color: #ffffff;
	box-shadow: ${({ theme }) => theme.shadows.dark};

	&::after {
		content: "";
		position: absolute;
		right: -90px;
		bottom: -120px;
		width: 280px;
		height: 280px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.07);
	}
`;

export const HeaderEyebrow = styled.div`
	width: fit-content;
	position: relative;
	z-index: 1;
	margin-bottom: ${({ theme }) => theme.spacing.md};
	padding: 8px 13px;
	border-radius: ${({ theme }) => theme.radii.pill};
	background: rgba(255, 255, 255, 0.1);
	color: ${({ theme }) => theme.colors.accent};
	border: 1px solid rgba(255, 255, 255, 0.18);
	font-size: 12px;
	font-weight: 950;
	letter-spacing: 0.07em;
	text-transform: uppercase;
`;

export const Title = styled.h1`
	position: relative;
	z-index: 1;
	max-width: 760px;
	margin: 0;
	color: #ffffff;
	font-size: clamp(38px, 4.6vw, 64px);
	line-height: 0.97;
	letter-spacing: -0.08em;
`;

export const Subtitle = styled.p`
	position: relative;
	z-index: 1;
	max-width: 680px;
	margin: ${({ theme }) => theme.spacing.md} 0 0;
	color: rgba(255, 255, 255, 0.72);
	font-size: 15px;
	line-height: 1.68;
`;

export const HeaderPanel = styled.aside`
	min-width: 0;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	padding: ${({ theme }) => theme.spacing.xl};
	border-radius: 32px;
	background:
		radial-gradient(
			circle at 16% 14%,
			rgba(200, 164, 93, 0.18),
			transparent 30%
		),
		${({ theme }) => theme.colors.surfaceDark};
	color: ${({ theme }) => theme.colors.textInverted};
	box-shadow: ${({ theme }) => theme.shadows.dark};
	border: 1px solid rgba(255, 255, 255, 0.12);
`;

export const HeaderPanelLabel = styled.span`
	color: rgba(255, 255, 255, 0.58);
	font-size: 12px;
	font-weight: 850;
	letter-spacing: 0.05em;
	text-transform: uppercase;
`;

export const HeaderPanelValue = styled.strong`
	margin-top: ${({ theme }) => theme.spacing.sm};
	color: ${({ theme }) => theme.colors.textInverted};
	font-size: 36px;
	line-height: 1;
	letter-spacing: -0.06em;
`;

export const HeaderPanelHint = styled.span`
	display: block;
	margin-top: ${({ theme }) => theme.spacing.sm};
	color: rgba(255, 255, 255, 0.62);
	font-size: 13px;
	line-height: 1.45;
`;

export const ContentGrid = styled.section`
	display: grid;
	grid-template-columns: minmax(0, 1fr) 420px;
	gap: ${({ theme }) => theme.spacing.lg};
	align-items: start;

	@media (max-width: 1120px) {
		grid-template-columns: 1fr;
	}
`;

export const MainColumn = styled.div`
	display: grid;
	gap: ${({ theme }) => theme.spacing.lg};
`;

export const SideColumn = styled.aside`
	display: grid;
	gap: ${({ theme }) => theme.spacing.lg};
`;

export const PanelCard = styled.section`
	min-width: 0;
	padding: ${({ theme }) => theme.spacing.lg};
	border-radius: 28px;
	background: ${({ theme }) => theme.colors.surface};
	border: 1px solid ${({ theme }) => theme.colors.border};
	box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const PanelHeader = styled.div`
	display: flex;
	justify-content: space-between;
	gap: ${({ theme }) => theme.spacing.md};
	align-items: flex-start;
	margin-bottom: ${({ theme }) => theme.spacing.lg};

	@media (max-width: 720px) {
		flex-direction: column;
	}
`;

export const PanelTitle = styled.h2`
	margin: 0;
	color: ${({ theme }) => theme.colors.primary};
	font-size: 24px;
	line-height: 1.08;
	letter-spacing: -0.05em;
`;

export const PanelSubtitle = styled.p`
	margin: ${({ theme }) => theme.spacing.xs} 0 0;
	color: ${({ theme }) => theme.colors.textMuted};
	font-size: 14px;
	line-height: 1.6;
`;

export const Form = styled.form`
	display: grid;
	gap: ${({ theme }) => theme.spacing.lg};
`;

export const FormGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 180px;
	gap: ${({ theme }) => theme.spacing.md};

	@media (max-width: 720px) {
		grid-template-columns: 1fr;
	}
`;

export const Field = styled.label`
	display: grid;
	gap: 8px;
	color: ${({ theme }) => theme.colors.text};
	font-size: 13px;
	font-weight: 900;
`;

export const Input = styled.input`
	width: 100%;
	min-height: 46px;
	padding: 0 14px;
	border-radius: 16px;
	border: 1px solid ${({ theme }) => theme.colors.border};
	background: rgba(255, 255, 255, 0.82);
	color: ${({ theme }) => theme.colors.primary};
	font-size: 14px;
	font-weight: 650;
	outline: none;
`;

export const CheckboxGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacing.sm};
`;

export const CheckboxCard = styled.label`
	display: flex;
	align-items: center;
	gap: 10px;
	min-height: 46px;
	padding: 0 14px;
	border-radius: 16px;
	background: ${({ theme }) => theme.colors.surfaceMuted};
	border: 1px solid ${({ theme }) => theme.colors.border};
	color: ${({ theme }) => theme.colors.primary};
	font-size: 13px;
	font-weight: 850;
	cursor: pointer;

	input {
		width: 16px;
		height: 16px;
	}
`;

export const Actions = styled.div`
	display: flex;
	gap: ${({ theme }) => theme.spacing.sm};
	flex-wrap: wrap;
	align-items: center;
`;

export const ActionButton = styled.button<{
	$variant?: "primary" | "danger" | "neutral";
}>`
	min-height: 42px;
	padding: 0 ${({ theme }) => theme.spacing.md};
	border-radius: ${({ theme }) => theme.radii.pill};
	font-size: 13px;
	font-weight: 950;
	cursor: pointer;
	transition:
		transform 0.18s ease,
		opacity 0.18s ease,
		background 0.18s ease;

	${({ theme, $variant }) => {
		if ($variant === "danger") {
			return css`
				color: ${theme.colors.danger};
				background: ${theme.colors.dangerBg};
				border: 1px solid ${theme.colors.dangerBorder};
			`;
		}

		if ($variant === "neutral") {
			return css`
				color: ${theme.colors.primary};
				background: ${theme.colors.surface};
				border: 1px solid ${theme.colors.border};
			`;
		}

		return css`
			color: #ffffff;
			background: #0b1f33;
			border: 1px solid #0b1f33;
		`;
	}}

	&:hover:not(:disabled) {
		transform: translateY(-1px);
	}

	&:disabled {
		opacity: 0.62;
		cursor: not-allowed;
	}
`;

export const GeneratedLinkBox = styled.div`
	display: grid;
	gap: ${({ theme }) => theme.spacing.md};
	padding: ${({ theme }) => theme.spacing.lg};
	border-radius: 24px;
	background: rgba(34, 197, 94, 0.1);
	border: 1px solid rgba(34, 197, 94, 0.22);
`;

export const GeneratedTitle = styled.strong`
	color: ${({ theme }) => theme.colors.success};
	font-size: 15px;
`;

export const CodeBox = styled.pre`
	margin: 0;
	padding: ${({ theme }) => theme.spacing.md};
	border-radius: 16px;
	background: rgba(11, 31, 51, 0.08);
	color: ${({ theme }) => theme.colors.primary};
	font-size: 12px;
	line-height: 1.55;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
`;

export const List = styled.div`
	display: grid;
	gap: ${({ theme }) => theme.spacing.md};
`;

export const ItemCard = styled.article`
	display: grid;
	gap: ${({ theme }) => theme.spacing.sm};
	padding: ${({ theme }) => theme.spacing.md};
	border-radius: 22px;
	background: rgba(255, 255, 255, 0.72);
	border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ItemTop = styled.div`
	display: flex;
	justify-content: space-between;
	gap: ${({ theme }) => theme.spacing.md};
	align-items: flex-start;

	@media (max-width: 620px) {
		flex-direction: column;
	}
`;

export const ItemTitle = styled.h3`
	min-width: 0;
	margin: 0;
	color: ${({ theme }) => theme.colors.primary};
	font-size: 15px;
	line-height: 1.2;
	overflow-wrap: anywhere;
`;

export const ItemMuted = styled.p`
	margin: 4px 0 0;
	color: ${({ theme }) => theme.colors.textMuted};
	font-size: 12px;
	line-height: 1.45;
	overflow-wrap: anywhere;
`;

export const Badge = styled.span<{
	$variant?: "success" | "warning" | "error" | "neutral";
}>`
	width: fit-content;
	display: inline-flex;
	min-height: 28px;
	align-items: center;
	justify-content: center;
	padding: 0 10px;
	border-radius: ${({ theme }) => theme.radii.pill};
	font-size: 11px;
	font-weight: 950;
	letter-spacing: 0.05em;
	text-transform: uppercase;

	${({ $variant }) => {
		if ($variant === "success") {
			return css`
				color: #166534;
				background: rgba(34, 197, 94, 0.14);
				border: 1px solid rgba(34, 197, 94, 0.22);
			`;
		}

		if ($variant === "warning") {
			return css`
				color: #92400e;
				background: rgba(245, 158, 11, 0.14);
				border: 1px solid rgba(245, 158, 11, 0.22);
			`;
		}

		if ($variant === "error") {
			return css`
				color: #991b1b;
				background: rgba(239, 68, 68, 0.12);
				border: 1px solid rgba(239, 68, 68, 0.2);
			`;
		}

		return css`
			color: #334155;
			background: rgba(148, 163, 184, 0.14);
			border: 1px solid rgba(148, 163, 184, 0.22);
		`;
	}}
`;

export const ErrorBox = styled.div`
	padding: ${({ theme }) => theme.spacing.md};
	border-radius: ${({ theme }) => theme.radii.lg};
	background: ${({ theme }) => theme.colors.dangerBg};
	color: ${({ theme }) => theme.colors.danger};
	border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
	line-height: 1.6;
`;

export const SuccessBox = styled.div`
	padding: ${({ theme }) => theme.spacing.md};
	border-radius: ${({ theme }) => theme.radii.lg};
	background: rgba(34, 197, 94, 0.1);
	color: ${({ theme }) => theme.colors.success};
	border: 1px solid rgba(34, 197, 94, 0.22);
	line-height: 1.6;
`;

export const EmptyState = styled.div`
	padding: ${({ theme }) => theme.spacing.xl};
	border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
	border-radius: 24px;
	text-align: center;
	color: ${({ theme }) => theme.colors.textMuted};
	background: ${({ theme }) => theme.colors.surface};
	line-height: 1.65;
`;

export const EmptyTitle = styled.strong`
	display: block;
	margin-bottom: ${({ theme }) => theme.spacing.sm};
	color: ${({ theme }) => theme.colors.primary};
	font-size: 18px;
`;
