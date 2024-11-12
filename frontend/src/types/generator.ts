/**
 * @description TextBox type for usage in the image editor.
 * */
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

/**
 * @description Image type for usage in the image editor and personal image gallery.
 * */
export interface Image {
    _id: string;
    url: string;
    name: string;
}