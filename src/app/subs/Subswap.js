import React from "react";
import { IoArrowDown } from "react-icons/io5";
import "../index.css";
import "./page.css";

import jszip from "jszip";
import toast, { Toaster } from "react-hot-toast";

export default function Sunswap(sub, index, text) {
  function downloadSrtFromZip(url) {
    toast("Downloading", {
      duration: 1000,
      style: {
        backgroundColor: "#f1c40f",
        color: "black",
      },
    });

    fetch(url)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return jszip.loadAsync(blob);
      })
      .then((zip) => {
        const srtFile = zip.file(/\.srt$/i);
        if (srtFile) {
          const srtContent = srtFile[0].async("text");
          srtContent.then((content) => {
            const filename = srtFile[0].name;
            const srtBlob = new Blob([content], {
              type: "text/plain;charset=utf-8",
            });

            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(srtBlob);
            downloadLink.download = filename;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.click();

            document.body.removeChild(downloadLink);
            toast.success("Downloaded!", {
              style: {
                backgroundColor: "#f1c40f",
                color: "black",
              },
            });
          });
        } else {
          console.error("No SRT file found in the zip");
        }
      })
      .catch((error) =>
        toast.error("Oh shoot! try another subtitle.", {
          style: {
            backgroundColor: "#f1c40f",
            color: "black",
          },
        })
      );
  }

  return (
    <>
      {" "}
      <button
        onClick={() => downloadSrtFromZip(`https://dl.subdl.com${sub.url}`)}
        className="subs"
        key={index}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <IoArrowDown
            style={{
              marginRight: "4px",
            }}
          />
          <span>{sub.release_name}</span>
        </div>
      </button>
    </>
  );
}
