import { useState, useEffect } from "react";
import socketIO from "socket.io-client";
const socket = socketIO.connect("http://localhost:4000");

const Modal = ({ url }) => {
    const [image, setImage] = useState("");
    const [fullHeight, setFullHeight] = useState("");
    useEffect(() => {
        socket.emit("browse", {
            url,
        });

        /*
        👇🏻 Listens for the images and full height 
             from the PuppeteerMassScreenshots.
           The image is also converted to a readable file.
        */
           socket.on("image", ({ img, fullHeight }) => {
            setImage("data:image/jpeg;base64," + img);
            setFullHeight(fullHeight);
        });
    }, [url]);

    return (
        <div className='popup'>
            <div className='popup-ref' style={{ height: fullHeight }}>
                {image && <img src={image} alt='' />}
            </div>
        </div>
    );
};

export default Modal;