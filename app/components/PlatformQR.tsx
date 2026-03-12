"use client";

import { QRCodeSVG } from "qrcode.react";

export default function PlatformQR() {
    return (
        <div className="flex flex-col items-center gap-2 mt-12 mb-4">
            <QRCodeSVG
                value="https://jiko.kr/?utm_source=qr&utm_medium=offline&utm_campaign=platform_qr"
                size={120}
                level="H"
            />
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">
                JIKO Platform
            </p>
        </div>
    );
}
