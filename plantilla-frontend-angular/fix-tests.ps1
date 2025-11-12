# Script para corregir automáticamente todos los archivos .spec.ts
$projectPath = "c:\Users\Luis Rios\OneDrive\COSAS_IMPORTANTES_MIOS\Documents\INGESOFT_2025-2\Sistema_FasTikets\plantilla-frontend-angular"

# Obtener todos los archivos .spec.ts
$specFiles = Get-ChildItem -Path $projectPath -Recurse -Filter "*.spec.ts"

Write-Host "Encontrados $($specFiles.Count) archivos .spec.ts para corregir..."

foreach ($file in $specFiles) {
    Write-Host "Procesando: $($file.Name)"
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Si ya tiene provideHttpClient, skip
    if ($content -match "provideHttpClient") {
        Write-Host "  Ya corregido: $($file.Name)"
        continue
    }
    
    # Agregar imports necesarios
    if ($content -match "import.*TestBed.*'@angular/core/testing'") {
        $content = $content -replace "(import { ComponentFixture, TestBed } from '@angular/core/testing';)", "`$1`nimport { provideHttpClient } from '@angular/common/http';`nimport { provideHttpClientTesting } from '@angular/common/http/testing';"
    }
    
    # Si necesita Router
    if ($content -match "router|Router|navigate") {
        $content = $content -replace "(import { provideHttpClientTesting } from '@angular/common/http/testing';)", "`$1`nimport { Router } from '@angular/router';"
    }
    
    # Si necesita ActivatedRoute
    if ($content -match "ActivatedRoute|route\.|params") {
        $content = $content -replace "(import { Router } from '@angular/router';)", "`$1`nimport { ActivatedRoute } from '@angular/router';"
    }
    
    # Si necesita MessageService
    if ($content -match "MessageService|message|toast") {
        $content = $content -replace "(import { ActivatedRoute } from '@angular/router';)", "`$1`nimport { MessageService } from 'primeng/api';"
    }
    
    # Si necesita DialogService
    if ($content -match "DialogService|dialog") {
        $content = $content -replace "(import { MessageService } from 'primeng/api';)", "`$1`nimport { DialogService } from 'primeng/dynamicdialog';"
    }
    
    # Agregar providers básicos
    if ($content -match "TestBed\.configureTestingModule\({") {
        $content = $content -replace "(providers: \[)", "`$1`n        provideHttpClient(),`n        provideHttpClientTesting(),"
        
        # Si no tiene providers array
        if ($content -notmatch "providers: \[") {
            $content = $content -replace "(declarations: \[[^\]]+\])", "`$1,`n      providers: [`n        provideHttpClient(),`n        provideHttpClientTesting()`n      ]"
        }
    }
    
    # Escribir el archivo solo si cambió
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "  ✓ Corregido: $($file.Name)"
    }
}

Write-Host "¡Proceso completado!"