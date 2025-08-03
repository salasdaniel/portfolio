#!/bin/bash
# Script de prueba para verificar la funcionalidad del perfil

echo "=== Verificando configuración del perfil ==="

echo "1. Verificando migración de base de datos..."
php artisan migrate:status | grep -E "(add_profile_fields|create_user_skills|remove_description)"

echo -e "\n2. Verificando enlace de storage..."
if [ -d "public/storage" ]; then
    echo "✅ Enlace de storage configurado correctamente"
else
    echo "❌ Enlace de storage no encontrado"
fi

echo -e "\n3. Verificando datos de semilla..."
php artisan tinker --execute="
echo 'Lenguajes de programación: ' . App\Models\ProgrammingLanguage::count();
echo '\nFrameworks: ' . App\Models\Framework::count();
echo '\nOtras tecnologías: ' . App\Models\UserOtherTechnology::count();
"

echo -e "\n4. Verificando rutas..."
php artisan route:list --name=profile

echo -e "\n=== Verificación completada ==="
