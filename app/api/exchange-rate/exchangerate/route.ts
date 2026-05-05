import { NextResponse } from "next/server";

const API_KEY = "38c477cefbdaec9ba0347d39";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const base = searchParams.get("base") || "KRW";

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`, {
            next: { revalidate: 3600 }, // 1 hour caching
        });

        if (!response.ok) {
            throw new Error(`ExchangeRate-API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("ExchangeRate-API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch exchange rates" },
            { status: 500 }
        );
    }
}
