import { FaXTwitter } from "react-icons/fa6";

export default function SiteFooter() {
    return (
        <footer className="footer">
            <div className="footer-row">
                <div>
                    <h3 style={{ fontSize: 28 }}>Contact us</h3>
                    <p>ellie_pavlick@brown.edu</p>
                </div>

                <a
                    href="https://x.com/Brown_NLP"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LUNAR Lab on X"
                >
                    <FaXTwitter size={26} />
                </a>
            </div>
        </footer>
    );
}
