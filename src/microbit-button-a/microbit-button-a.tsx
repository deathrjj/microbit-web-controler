import { h, Component, Prop, Element, Watch, State } from "@stencil/core";
import { Services } from "microbit-web-bluetooth";
import { microbitStore } from '../microbit-store';

@Component({
    tag: 'microbit-button-a'
})
export class MicrobitButtonA {
    constructor() {
        microbitStore.addListener(this);
    }

    @Element()
    protected el;

    @Prop({mutable: true})
    public services: Services = null;

    /**
     * The CSS class to use when released
     */
    @Prop()
    public releaseClass: string = "microbit-release";

    /**
     * The CSS class to use when short-pressed
     */
    @Prop()
    public shortPressClass: string = "microbit-short-press";

    /**
     * The CSS class to use when long-pressed
     */
    @Prop()
    public longPressClass: string = "microbit-long-press";

    @State()
    protected className = this.releaseClass;

    @Watch('services')
    protected async servicesUpdated() {
        if (!this.services || !this.services.buttonService) {
            this.className = this.releaseClass;
            return;
        }

        const service = this.services.buttonService;
        await service.addEventListener("buttonastatechanged", event => this.setClassName(event.detail));
        this.setClassName(await service.readButtonAState());
    }

    private setClassName(state: number) {
        if (state === 1) {
            console.log("Button A pressed: short press");
            fetch("http://192.168.1.206:8123/api/webhook/-6qi7r6cUdXuChtt8Ko22Z1Xg", { method: 'POST' }).catch(err => console.error(err));
        } else if (state === 2) {
            console.log("Button A pressed: long press");
            fetch("http://192.168.1.206:8123/api/webhook/-6qi7r6cUdXuChtt8Ko22Z1Xg", { method: 'POST' }).catch(err => console.error(err));
        }
        this.className = state === 1 ? this.shortPressClass
        : state === 2 ? this.longPressClass
        : this.releaseClass;
    }

    public render() {
        return (
            <span class={this.className}>
                <slot />
            </span>
        );
    }
}
