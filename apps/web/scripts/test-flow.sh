#!/bin/bash

echo "🚀 Testando o fluxo completo do Plane Clone..."

echo "1. Verificando se o servidor está rodando..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Servidor não está rodando. Inicie com: npm run dev"
    exit 1
fi

echo "✅ Servidor rodando!"

echo "2. Testando autenticação..."
# Testes podem ser adicionados aqui

echo "3. Acessando dashboard..."
open http://localhost:3000/dashboard

echo "🎉 Fluxo pronto para teste!"
echo ""
echo "📋 Próximos passos manuais:"
echo "1. Crie um Workspace"
echo "2. Crie um Project dentro do Workspace"
echo "3. Crie Issues no projeto"
echo "4. Teste o drag-and-drop no Kanban"
echo "5. Teste o editor Tiptap nas issues"
