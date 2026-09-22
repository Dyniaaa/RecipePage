export const runtime = "nodejs";

import { hash } from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { createUser } from "@/lib/user";
import { resend } from "@/lib/resend";
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    const nameError = validateRequired(String(name || "").trim(), "Imię");
    const emailError = validateEmail(String(email || ""));
    const passwordError = validatePassword(String(password || ""));

    if (nameError || emailError || passwordError) {
      return NextResponse.json(
        { message: nameError || emailError || passwordError },
        { status: 400 },
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const hashedPassword = await hash(password, 10);

    await createUser(
      name,
      email,
      hashedPassword,
      verificationToken,
      verificationExpiry,
    );

    const verificationUrl = `${process.env.APP_URL}/verifyEmail?token=${verificationToken}`;

    const emailResult = await resend.emails.send({
      from: "Happy Avocado <noreply@happyavocado.pl>",
      to: email,
      subject: "🥑 Potwierdź swoje konto w Happy Avocado",
      html: `
    <!DOCTYPE html>
    <html lang="pl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Potwierdź swoje konto</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #fff7fb;
          font-family: Arial, Helvetica, sans-serif;
          color: #1f2937;
        "
      >

        <div
          style="
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
          "
        >

          <div
            style="
              background-color: #ffffff;
              border-radius: 24px;
              padding: 40px 32px;
              border: 1px solid #f3d1e3;
              text-align: center;
            "
          >

            <div
              style="
                font-size: 48px;
                margin-bottom: 10px;
              "
            >
              🥑
            </div>

            <h1
              style="
                margin: 0 0 12px;
                color: #dc1f85;
                font-size: 30px;
              "
            >
              Witaj w Happy Avocado!
            </h1>

            <p
              style="
                margin: 0 0 24px;
                color: #6b7280;
                font-size: 16px;
                line-height: 1.6;
              "
            >
              Cieszymy się, że jesteś z nami!
              Został już tylko jeden krok, aby aktywować Twoje konto.
            </p>

            <div
              style="
                background-color: #fff0f7;
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 28px;
              "
            >
              <p
                style="
                  margin: 0;
                  color: #374151;
                  font-size: 15px;
                  line-height: 1.6;
                "
              >
                Kliknij przycisk poniżej, aby potwierdzić swój adres
                e-mail i rozpocząć swoją kulinarną przygodę.
              </p>
            </div>

            <a
              href="${verificationUrl}"
              style="
                display: inline-block;
                padding: 15px 28px;
                background-color: #dc1f85;
                color: #ffffff;
                text-decoration: none;
                border-radius: 999px;
                font-size: 16px;
                font-weight: bold;
              "
            >
              Potwierdź moje konto
            </a>

            <p
              style="
                margin: 28px 0 0;
                color: #9ca3af;
                font-size: 13px;
                line-height: 1.5;
              "
            >
              Link jest ważny przez 24 godziny.
            </p>

            <p
              style="
                margin: 16px 0 0;
                color: #9ca3af;
                font-size: 12px;
                line-height: 1.5;
              "
            >
              Jeśli to nie Ty zakładałeś konto w Happy Avocado,
              możesz zignorować tę wiadomość.
            </p>

          </div>

          <p
            style="
              text-align: center;
              margin-top: 20px;
              color: #9ca3af;
              font-size: 12px;
            "
          >
            © ${new Date().getFullYear()} Happy Avocado
          </p>

        </div>

      </body>
    </html>
  `,
    });

    console.log("Wynik Resend:", emailResult);

    return NextResponse.json(
      {
        message: "Konto zostało utworzone. Sprawdź swój adres e-mail.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Błąd rejestracji:", error);

    return NextResponse.json({ message: "Błąd serwera" }, { status: 500 });
  }
}
