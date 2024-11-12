export interface TextBox {
    text: string;
    font: string;
    fontSize: number;
    fontColor: string;
    whiteBox: boolean;
    whiteBoxPadding: number;
    sidebars: boolean;
    sidebarWidth: number;
    position: {
        x: number;
        y: number;
    }
}

export interface Image {
    _id: string;
    url: string;
    name: string;
}