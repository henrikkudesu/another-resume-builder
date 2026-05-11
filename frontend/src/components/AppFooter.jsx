import { UI_TEXT } from "../content/uiText.pt-br";

export default function AppFooter() {
    return (
        <footer className="app-footer">
            <p>
                {UI_TEXT.footer.label}{" "}
                <a
                    href={UI_TEXT.footer.linkHref}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    {UI_TEXT.footer.linkText}
                </a>
            </p>
        </footer>
    );
}