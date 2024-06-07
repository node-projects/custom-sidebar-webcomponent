import { BaseCustomWebComponentConstructorAppend, html, css, property } from '@node-projects/base-custom-webcomponent';

export class CustomSidebarWebcomponent extends BaseCustomWebComponentConstructorAppend {

    @property(String)
    public sidebarWidth = "300";

    @property(String)
    public sidebarBackgroundColor = "lightgrey";

    @property(String)
    public toggleButtonBackgroundColor = "lightgrey";

    @property(String)
    public toggleButtonColor: "black" | "white" = "black";

    @property(String)
    public sidebarPosition: "left" | "right" = "right";

    @property(String)
    public sidebarToggleButtonTopPosition = "25";

    private _sidebar: HTMLDivElement;
    private _sidebarContent: HTMLSlotElement;
    private _toggleButton: HTMLButtonElement;
    private _observer: MutationObserver;

    static override readonly template = html`
        <div class="sidebar" id="sidebar" collapsed="true">
            <button class="toggle-button" id="toggle-button"></button>
            <slot class="sidebar-content" id="sidebar-content"></slot>
        </div>
    `;

    static override readonly style = css`
        :host {
            display: block;
            box-sizing: border-box;
            margin: 0px;
            padding: 0px;
        }
        :host([hidden]) {
            display: none;
        }

        .sidebar {
            border: none;
            border-radius: 10px 0px 0px 10px;
            background-color: #7f8c8d;
            position: fixed;
            top: 0px;
            right: 0px;
            height: 100%;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
            transition: width 0.3s;
            z-index: 1000;
        }

        .toggle-button {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: calc(50% - 25px);
            width: 40px;
            height: 50px;
            padding: 0px;
            color: white;
            border: none;
            border-radius: 10px 0px 0px 10px;
            cursor: pointer;
            font-size: 1.2em;
            transition: transform 0.3s, right 0.3s, left 0.3s;
            z-index: 1001;
        }

        #toggle-svg {
            width: 30px;
            height: 25px;
        }

        .sidebar-content {
            opacity: 0;
            transition: opacity 0.3s;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
    `;

    static readonly is = 'node-projects-sidebar';

    static readonly properties = {

    }

    constructor() {
        super();
        super._restoreCachedInititalValues();

        this._observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'collapsed') {
                    this._collapseSidebar();
                }
            }
        });

        this._sidebar = this._getDomElement<HTMLDivElement>("sidebar");
        this._sidebarContent = this._getDomElement<HTMLSlotElement>("sidebar-content");
        this._toggleButton = this._getDomElement<HTMLButtonElement>("toggle-button");
    }

    connectedCallback() {
        this._observer.observe(this._sidebar, { attributes: true });
    }

    disconnectedCallback() {
        this._observer.disconnect();
    }

    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
        this._initSideBar();
    }

    private _initSideBar() {
        this._sidebar.style.backgroundColor = this.sidebarBackgroundColor;
        this._sidebar.style.maxWidth = this.sidebarWidth + "px";
        this._toggleButton.style.backgroundColor = this.toggleButtonBackgroundColor;
        this._toggleButton.style.top = "calc(" + this.sidebarToggleButtonTopPosition + "% - 25px)";

        const svg = document.createElement("img");
        svg.id = "toggle-svg";
        if (this.toggleButtonColor === "black") {
            svg.src = "../../assets/sidebarToggleDark.svg";
        } else {
            svg.src = "../../assets/sidebarToggle.svg";
        }
        this._toggleButton.appendChild(svg);

        if (this.sidebarPosition === "left") {
            this._sidebar.style.left = "0px";
            this._toggleButton.style.transform = "translateX(-50%)";
            if (this._sidebar.getAttribute("collapsed") === "true") {
                this._sidebar.style.width = "0px";
                this._toggleButton.style.left = "20px";
                this._sidebarContent.style.opacity = '0';
            } else {
                this._sidebar.style.width = this.sidebarWidth + "px";
                this._toggleButton.style.left = (parseInt(this.sidebarWidth) + 20).toString() + "px";
            }
            this._sidebar.style.borderRadius = "0px 10px 10px 0px";
            this._toggleButton.style.borderRadius = "0px 10px 10px 0px";
        } else if (this.sidebarPosition === "right") {
            this._sidebar.style.right = "0px";
            this._toggleButton.style.transform = "translateX(50%)";
            if (this._sidebar.getAttribute("collapsed") === "true") {
                this._sidebar.style.width = "0px";
                this._toggleButton.style.right = "20px";
                this._sidebarContent.style.opacity = '0';
            } else {
                this._sidebar.style.width = this.sidebarWidth + "px";
                this._toggleButton.style.right = (parseInt(this.sidebarWidth) + 20).toString() + "px";
            }
            this._sidebar.style.borderRadius = "10px 0px 0px 10px";
            this._toggleButton.style.borderRadius = "10px 0px 0px 10px";
        }

        this._toggleButton.onclick = () => {
            if (this._sidebar.hasAttribute("collapsed") && this._sidebar.getAttribute("collapsed") === "true") {
                this._sidebar.setAttribute("collapsed", "false");
            } else {
                this._sidebar.setAttribute("collapsed", "true");
            }
        }
    }

    private _collapseSidebar() {
        if (this._sidebar.getAttribute("collapsed") === "true") {
            this._sidebarContent.style.opacity = '0';
            this._sidebar.style.width = '0px';
            if (this.sidebarPosition === "left") {
                this._toggleButton.style.left = '20px';
            } else if (this.sidebarPosition === "right") {
                this._toggleButton.style.right = '20px';
            }
        } else {
            this._sidebar.style.width = this.sidebarWidth + 'px';
            this._sidebarContent.style.opacity = '100';
            if (this.sidebarPosition === "left") {
                this._toggleButton.style.transform = "translateX(-50%)";
                this._toggleButton.style.left = (parseInt(this.sidebarWidth) + 20).toString() + 'px';
            } else if (this.sidebarPosition === "right") {
                this._toggleButton.style.transform = "translateX(50%)";
                this._toggleButton.style.right = (parseInt(this.sidebarWidth) + 20).toString() + 'px';
            }
        }
    }
}
customElements.define(CustomSidebarWebcomponent.is, CustomSidebarWebcomponent)