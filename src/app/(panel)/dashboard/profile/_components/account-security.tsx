"use client"

import { Button } from "@/components/ui/button";
import { User } from "@/generated/prisma";
import { AlertCircle, CheckCircle, Mail, Shield } from "lucide-react";
import { toast } from "react-toastify";

export default function AccountSecurity({ detailUser }: { detailUser: User }) {
  const isVerified = detailUser.emailVerified !== null;

  const sendVerificationEmail = async () => {
    try {
      const responsePromise = fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: detailUser.email }),
      });

      await toast.promise(responsePromise, {
        pending: 'Enviando e-mail de verificação...',
        success: 'E-mail de verificação enviado com sucesso!',
        error: 'Falha ao enviar o e-mail de verificação.',
      });

      // Opcional: verificar se a resposta foi ok
      const response = await responsePromise;
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send verification email');
      }

    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };


  return (
    <div className="w-full">
      <div className="space-y-6">
        <div className="space-y-4 p-4 rounded-xl border">
          <div className="flex items-center gap-3">
            {isVerified ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700">Email Verified</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-orange-700" />
                <span className="font-semibold text-orange-700">Email Not Verified</span>
              </>
            )}
          </div>
          <p className="text-sm">
            {isVerified
              ? `Seu e-mail foi verificado em ${detailUser.emailVerified?.toLocaleDateString()}`
              : 'Verifique seu e-mail e clique no link de verificação para proteger sua conta.'
            }
          </p>
          {!isVerified && (
            <Button className="cursor-pointer" size="sm" onClick={sendVerificationEmail}>
              Reenviar e-mail de verificação
            </Button>
          )}
        </div>

        {/* Security Settings */}
        <div className="space-y-4 opacity-50 cursor-not-allowed p-4 rounded-xl border">
          <h3 className="font-semibold text-lg">Security Settings</h3>
          <div className="space-y-3">
            <div className="border flex items-center justify-between py-3 px-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span className="font-medium">Two-Factor Authentication</span>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Desabilitado
              </button>
            </div>
            <div className="border flex items-center justify-between py-3 px-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Login Alerts</span>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Gerenciar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};