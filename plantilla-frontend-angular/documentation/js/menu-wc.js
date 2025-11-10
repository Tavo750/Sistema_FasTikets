'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">plantilla documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdministradorModule.html" data-type="entity-link" >AdministradorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AdministradorModule-d47d0581deb278f9a12f350dd6dcbc3d3f62b73c96f7f7e30f2dd7a15258dbeccf83c42e6812bdde41c9f7242cbaa04760df78edc68d72399873d8cf5243769d"' : 'data-bs-target="#xs-components-links-module-AdministradorModule-d47d0581deb278f9a12f350dd6dcbc3d3f62b73c96f7f7e30f2dd7a15258dbeccf83c42e6812bdde41c9f7242cbaa04760df78edc68d72399873d8cf5243769d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdministradorModule-d47d0581deb278f9a12f350dd6dcbc3d3f62b73c96f7f7e30f2dd7a15258dbeccf83c42e6812bdde41c9f7242cbaa04760df78edc68d72399873d8cf5243769d"' :
                                            'id="xs-components-links-module-AdministradorModule-d47d0581deb278f9a12f350dd6dcbc3d3f62b73c96f7f7e30f2dd7a15258dbeccf83c42e6812bdde41c9f7242cbaa04760df78edc68d72399873d8cf5243769d"' }>
                                            <li class="link">
                                                <a href="components/AuditoriaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuditoriaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CambiarContrasenaAdminComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CambiarContrasenaAdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CodigosPromocionalesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodigosPromocionalesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CrearEventoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CrearEventoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CrearLocalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CrearLocalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetalleRegistroPromoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetalleRegistroPromoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarClienteAdmiComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditarClienteAdmiComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarEventoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditarEventoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarLocalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditarLocalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarRegistroPromoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditarRegistroPromoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GestionClientesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestionClientesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GestionEventosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestionEventosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GestionLocalesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestionLocalesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogErroresComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogErroresComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PerfilAdministradorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PerfilAdministradorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroCodigosPromoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroCodigosPromoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerDetalleClienteAdmiComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerDetalleClienteAdmiComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AdministradorModule-d47d0581deb278f9a12f350dd6dcbc3d3f62b73c96f7f7e30f2dd7a15258dbeccf83c42e6812bdde41c9f7242cbaa04760df78edc68d72399873d8cf5243769d"' : 'data-bs-target="#xs-injectables-links-module-AdministradorModule-d47d0581deb278f9a12f350dd6dcbc3d3f62b73c96f7f7e30f2dd7a15258dbeccf83c42e6812bdde41c9f7242cbaa04760df78edc68d72399873d8cf5243769d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AdministradorModule-d47d0581deb278f9a12f350dd6dcbc3d3f62b73c96f7f7e30f2dd7a15258dbeccf83c42e6812bdde41c9f7242cbaa04760df78edc68d72399873d8cf5243769d"' :
                                        'id="xs-injectables-links-module-AdministradorModule-d47d0581deb278f9a12f350dd6dcbc3d3f62b73c96f7f7e30f2dd7a15258dbeccf83c42e6812bdde41c9f7242cbaa04760df78edc68d72399873d8cf5243769d"' }>
                                        <li class="link">
                                            <a href="injectables/MessageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdministradorRoutingModule.html" data-type="entity-link" >AdministradorRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-38402521c762e4e5f89075d141e66e2b69c1f1f6b71dc7cf79991aa7dc2ad6bf42ce0d1773079786d79583d203b97e756f6030dca61e6a1d8b38c38a20f1f7f8"' : 'data-bs-target="#xs-components-links-module-AppModule-38402521c762e4e5f89075d141e66e2b69c1f1f6b71dc7cf79991aa7dc2ad6bf42ce0d1773079786d79583d203b97e756f6030dca61e6a1d8b38c38a20f1f7f8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-38402521c762e4e5f89075d141e66e2b69c1f1f6b71dc7cf79991aa7dc2ad6bf42ce0d1773079786d79583d203b97e756f6030dca61e6a1d8b38c38a20f1f7f8"' :
                                            'id="xs-components-links-module-AppModule-38402521c762e4e5f89075d141e66e2b69c1f1f6b71dc7cf79991aa7dc2ad6bf42ce0d1773079786d79583d203b97e756f6030dca61e6a1d8b38c38a20f1f7f8"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-38402521c762e4e5f89075d141e66e2b69c1f1f6b71dc7cf79991aa7dc2ad6bf42ce0d1773079786d79583d203b97e756f6030dca61e6a1d8b38c38a20f1f7f8"' : 'data-bs-target="#xs-injectables-links-module-AppModule-38402521c762e4e5f89075d141e66e2b69c1f1f6b71dc7cf79991aa7dc2ad6bf42ce0d1773079786d79583d203b97e756f6030dca61e6a1d8b38c38a20f1f7f8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-38402521c762e4e5f89075d141e66e2b69c1f1f6b71dc7cf79991aa7dc2ad6bf42ce0d1773079786d79583d203b97e756f6030dca61e6a1d8b38c38a20f1f7f8"' :
                                        'id="xs-injectables-links-module-AppModule-38402521c762e4e5f89075d141e66e2b69c1f1f6b71dc7cf79991aa7dc2ad6bf42ce0d1773079786d79583d203b97e756f6030dca61e6a1d8b38c38a20f1f7f8"' }>
                                        <li class="link">
                                            <a href="injectables/MessageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CambiarContraModule.html" data-type="entity-link" >CambiarContraModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-CambiarContraModule-2dddf4484659f83c2df89992da545362d5907a3f535cf8553a44fe0dbb13f8a5e9995ba0a1dacc2b421e82df14f5244d79503b5202b7c2f3f3a9acf4e8d5669a"' : 'data-bs-target="#xs-components-links-module-CambiarContraModule-2dddf4484659f83c2df89992da545362d5907a3f535cf8553a44fe0dbb13f8a5e9995ba0a1dacc2b421e82df14f5244d79503b5202b7c2f3f3a9acf4e8d5669a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CambiarContraModule-2dddf4484659f83c2df89992da545362d5907a3f535cf8553a44fe0dbb13f8a5e9995ba0a1dacc2b421e82df14f5244d79503b5202b7c2f3f3a9acf4e8d5669a"' :
                                            'id="xs-components-links-module-CambiarContraModule-2dddf4484659f83c2df89992da545362d5907a3f535cf8553a44fe0dbb13f8a5e9995ba0a1dacc2b421e82df14f5244d79503b5202b7c2f3f3a9acf4e8d5669a"' }>
                                            <li class="link">
                                                <a href="components/CambiarContraComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CambiarContraComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogEnvioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogEnvioComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CambiarContraRoutingModule.html" data-type="entity-link" >CambiarContraRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link" >CoreModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-CoreModule-2bdb7867c27e5397b8374db4b93e5cccb3fd9dc648e3d70e690becfb8abd7d6e87ae3c6acc0a517a08b65c9a139721f5c9a479fc0b2d34e15909a498a192bdd0"' : 'data-bs-target="#xs-components-links-module-CoreModule-2bdb7867c27e5397b8374db4b93e5cccb3fd9dc648e3d70e690becfb8abd7d6e87ae3c6acc0a517a08b65c9a139721f5c9a479fc0b2d34e15909a498a192bdd0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CoreModule-2bdb7867c27e5397b8374db4b93e5cccb3fd9dc648e3d70e690becfb8abd7d6e87ae3c6acc0a517a08b65c9a139721f5c9a479fc0b2d34e15909a498a192bdd0"' :
                                            'id="xs-components-links-module-CoreModule-2bdb7867c27e5397b8374db4b93e5cccb3fd9dc648e3d70e690becfb8abd7d6e87ae3c6acc0a517a08b65c9a139721f5c9a479fc0b2d34e15909a498a192bdd0"' }>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidebarItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidebarItemComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CrearUsuarioModule.html" data-type="entity-link" >CrearUsuarioModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-CrearUsuarioModule-7a9d07ce1acfb143f1418ddf43e186347937dd8cf9aa0e4a3c4fa6fe7d507be68a6f901118e6bac7a1d3bb121de5f455f2ea8a788ede25d42b511f6ba15ce4b5"' : 'data-bs-target="#xs-components-links-module-CrearUsuarioModule-7a9d07ce1acfb143f1418ddf43e186347937dd8cf9aa0e4a3c4fa6fe7d507be68a6f901118e6bac7a1d3bb121de5f455f2ea8a788ede25d42b511f6ba15ce4b5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CrearUsuarioModule-7a9d07ce1acfb143f1418ddf43e186347937dd8cf9aa0e4a3c4fa6fe7d507be68a6f901118e6bac7a1d3bb121de5f455f2ea8a788ede25d42b511f6ba15ce4b5"' :
                                            'id="xs-components-links-module-CrearUsuarioModule-7a9d07ce1acfb143f1418ddf43e186347937dd8cf9aa0e4a3c4fa6fe7d507be68a6f901118e6bac7a1d3bb121de5f455f2ea8a788ede25d42b511f6ba15ce4b5"' }>
                                            <li class="link">
                                                <a href="components/CrearUsuarioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CrearUsuarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogExitosoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogExitosoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogPoliticaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogPoliticaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogTerminosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogTerminosComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CrearUsuarioRoutingModule.html" data-type="entity-link" >CrearUsuarioRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ErrorModule.html" data-type="entity-link" >ErrorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ErrorModule-8c72ad57116cea28acb910aab2130ae31aca7b56d307f564ccd4d2b1cf1951dd463f0562269ab3c38f2f1c10ece3f5e237b1ac01308f4a16835d44a3574c32e9"' : 'data-bs-target="#xs-components-links-module-ErrorModule-8c72ad57116cea28acb910aab2130ae31aca7b56d307f564ccd4d2b1cf1951dd463f0562269ab3c38f2f1c10ece3f5e237b1ac01308f4a16835d44a3574c32e9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ErrorModule-8c72ad57116cea28acb910aab2130ae31aca7b56d307f564ccd4d2b1cf1951dd463f0562269ab3c38f2f1c10ece3f5e237b1ac01308f4a16835d44a3574c32e9"' :
                                            'id="xs-components-links-module-ErrorModule-8c72ad57116cea28acb910aab2130ae31aca7b56d307f564ccd4d2b1cf1951dd463f0562269ab3c38f2f1c10ece3f5e237b1ac01308f4a16835d44a3574c32e9"' }>
                                            <li class="link">
                                                <a href="components/ErrorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ErrorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ErrorRoutingModule.html" data-type="entity-link" >ErrorRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomeModule.html" data-type="entity-link" >HomeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-HomeModule-41df26fe9fc2729d07bf889c064dc8ebe63497c26a954eb804551c432c72f35d4a888702ce1f5dd5097a373791489d56a81b613efcbe5492c459184ab850076e"' : 'data-bs-target="#xs-components-links-module-HomeModule-41df26fe9fc2729d07bf889c064dc8ebe63497c26a954eb804551c432c72f35d4a888702ce1f5dd5097a373791489d56a81b613efcbe5492c459184ab850076e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomeModule-41df26fe9fc2729d07bf889c064dc8ebe63497c26a954eb804551c432c72f35d4a888702ce1f5dd5097a373791489d56a81b613efcbe5492c459184ab850076e"' :
                                            'id="xs-components-links-module-HomeModule-41df26fe9fc2729d07bf889c064dc8ebe63497c26a954eb804551c432c72f35d4a888702ce1f5dd5097a373791489d56a81b613efcbe5492c459184ab850076e"' }>
                                            <li class="link">
                                                <a href="components/CarritoCompraComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CarritoCompraComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CarritoItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CarritoItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CompraEntradasComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompraEntradasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InicioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InicioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResumenCarritoCompraComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResumenCarritoCompraComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-HomeModule-41df26fe9fc2729d07bf889c064dc8ebe63497c26a954eb804551c432c72f35d4a888702ce1f5dd5097a373791489d56a81b613efcbe5492c459184ab850076e"' : 'data-bs-target="#xs-injectables-links-module-HomeModule-41df26fe9fc2729d07bf889c064dc8ebe63497c26a954eb804551c432c72f35d4a888702ce1f5dd5097a373791489d56a81b613efcbe5492c459184ab850076e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HomeModule-41df26fe9fc2729d07bf889c064dc8ebe63497c26a954eb804551c432c72f35d4a888702ce1f5dd5097a373791489d56a81b613efcbe5492c459184ab850076e"' :
                                        'id="xs-injectables-links-module-HomeModule-41df26fe9fc2729d07bf889c064dc8ebe63497c26a954eb804551c432c72f35d4a888702ce1f5dd5097a373791489d56a81b613efcbe5492c459184ab850076e"' }>
                                        <li class="link">
                                            <a href="injectables/MessageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomeRoutingModule.html" data-type="entity-link" >HomeRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoginModule.html" data-type="entity-link" >LoginModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-LoginModule-ea5262eb22b384f9640436d6a206d8a95b524352e3c8535c6d09f50c34aa0f0f9843f7308b31486f537c2b47affcc4e11add5626f79fac666a76dcd689348fb2"' : 'data-bs-target="#xs-components-links-module-LoginModule-ea5262eb22b384f9640436d6a206d8a95b524352e3c8535c6d09f50c34aa0f0f9843f7308b31486f537c2b47affcc4e11add5626f79fac666a76dcd689348fb2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginModule-ea5262eb22b384f9640436d6a206d8a95b524352e3c8535c6d09f50c34aa0f0f9843f7308b31486f537c2b47affcc4e11add5626f79fac666a76dcd689348fb2"' :
                                            'id="xs-components-links-module-LoginModule-ea5262eb22b384f9640436d6a206d8a95b524352e3c8535c6d09f50c34aa0f0f9843f7308b31486f537c2b47affcc4e11add5626f79fac666a76dcd689348fb2"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginRoutingModule.html" data-type="entity-link" >LoginRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PrimeNgModule.html" data-type="entity-link" >PrimeNgModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SharedModule-2e6e10e7b5465d01065f100428244beb468d2535d357fdd3337490c0628e1edb11b94fbe7828b4b2515f5f70ad757547ef2130f3de5bc8a781a2cc28dea385bf"' : 'data-bs-target="#xs-components-links-module-SharedModule-2e6e10e7b5465d01065f100428244beb468d2535d357fdd3337490c0628e1edb11b94fbe7828b4b2515f5f70ad757547ef2130f3de5bc8a781a2cc28dea385bf"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-2e6e10e7b5465d01065f100428244beb468d2535d357fdd3337490c0628e1edb11b94fbe7828b4b2515f5f70ad757547ef2130f3de5bc8a781a2cc28dea385bf"' :
                                            'id="xs-components-links-module-SharedModule-2e6e10e7b5465d01065f100428244beb468d2535d357fdd3337490c0628e1edb11b94fbe7828b4b2515f5f70ad757547ef2130f3de5bc8a781a2cc28dea385bf"' }>
                                            <li class="link">
                                                <a href="components/DialogoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoadingSpinnerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoadingSpinnerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsuarioModule.html" data-type="entity-link" >UsuarioModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-UsuarioModule-5657f4d737305953ec4ac085e90e63282b8e72a0976cb026b8aa0ffa0e4b73b921ad40c78a8fc672206e4ed5c4d2d259e0b33f60c31e0e6c7d9f3b62d897efae"' : 'data-bs-target="#xs-components-links-module-UsuarioModule-5657f4d737305953ec4ac085e90e63282b8e72a0976cb026b8aa0ffa0e4b73b921ad40c78a8fc672206e4ed5c4d2d259e0b33f60c31e0e6c7d9f3b62d897efae"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UsuarioModule-5657f4d737305953ec4ac085e90e63282b8e72a0976cb026b8aa0ffa0e4b73b921ad40c78a8fc672206e4ed5c4d2d259e0b33f60c31e0e6c7d9f3b62d897efae"' :
                                            'id="xs-components-links-module-UsuarioModule-5657f4d737305953ec4ac085e90e63282b8e72a0976cb026b8aa0ffa0e4b73b921ad40c78a8fc672206e4ed5c4d2d259e0b33f60c31e0e6c7d9f3b62d897efae"' }>
                                            <li class="link">
                                                <a href="components/BeneficiosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BeneficiosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CambiarContrasenaUsuarioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CambiarContrasenaUsuarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmarTransferenciaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmarTransferenciaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistorialComprasComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HistorialComprasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MisEntradasComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MisEntradasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PerfilPersonalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PerfilPersonalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsuarioModule-5657f4d737305953ec4ac085e90e63282b8e72a0976cb026b8aa0ffa0e4b73b921ad40c78a8fc672206e4ed5c4d2d259e0b33f60c31e0e6c7d9f3b62d897efae"' : 'data-bs-target="#xs-injectables-links-module-UsuarioModule-5657f4d737305953ec4ac085e90e63282b8e72a0976cb026b8aa0ffa0e4b73b921ad40c78a8fc672206e4ed5c4d2d259e0b33f60c31e0e6c7d9f3b62d897efae"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsuarioModule-5657f4d737305953ec4ac085e90e63282b8e72a0976cb026b8aa0ffa0e4b73b921ad40c78a8fc672206e4ed5c4d2d259e0b33f60c31e0e6c7d9f3b62d897efae"' :
                                        'id="xs-injectables-links-module-UsuarioModule-5657f4d737305953ec4ac085e90e63282b8e72a0976cb026b8aa0ffa0e4b73b921ad40c78a8fc672206e4ed5c4d2d259e0b33f60c31e0e6c7d9f3b62d897efae"' }>
                                        <li class="link">
                                            <a href="injectables/MessageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsuarioRoutingModule.html" data-type="entity-link" >UsuarioRoutingModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BeneficiosService.html" data-type="entity-link" >BeneficiosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CartService.html" data-type="entity-link" >CartService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CodigosPromocionalesService.html" data-type="entity-link" >CodigosPromocionalesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfirmPopupService.html" data-type="entity-link" >ConfirmPopupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorService.html" data-type="entity-link" >ErrorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventoService.html" data-type="entity-link" >EventoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FullscreenService.html" data-type="entity-link" >FullscreenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GestionClientesService.html" data-type="entity-link" >GestionClientesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HistorialPuntosService.html" data-type="entity-link" >HistorialPuntosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpUtilsService.html" data-type="entity-link" >HttpUtilsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InactivityService.html" data-type="entity-link" >InactivityService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoadingService.html" data-type="entity-link" >LoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalService.html" data-type="entity-link" >LocalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoginService.html" data-type="entity-link" >LoginService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MenuService.html" data-type="entity-link" >MenuService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessageService.html" data-type="entity-link" >MessageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PerfilAdministradorService.html" data-type="entity-link" >PerfilAdministradorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PerfilPersonalService.html" data-type="entity-link" >PerfilPersonalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PurchaseService.html" data-type="entity-link" >PurchaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RegistroUsuarioService.html" data-type="entity-link" >RegistroUsuarioService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestHandlerService.html" data-type="entity-link" >RequestHandlerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SessionService.html" data-type="entity-link" >SessionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThemeService.html" data-type="entity-link" >ThemeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenService.html" data-type="entity-link" >TokenService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link" >AuthInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ActualizarPerfilRequest.html" data-type="entity-link" >ActualizarPerfilRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BeneficiosResponse.html" data-type="entity-link" >BeneficiosResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BodyCodigosPromocionales.html" data-type="entity-link" >BodyCodigosPromocionales</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BodyPerfilPersonal.html" data-type="entity-link" >BodyPerfilPersonal</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CacheStore.html" data-type="entity-link" >CacheStore</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CambiarContrasenaRequest.html" data-type="entity-link" >CambiarContrasenaRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CambiarContrasenaResponse.html" data-type="entity-link" >CambiarContrasenaResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CambiarContrasenaUsuarioRequest.html" data-type="entity-link" >CambiarContrasenaUsuarioRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CambiarContrasenaUsuarioResponse.html" data-type="entity-link" >CambiarContrasenaUsuarioResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CartItem.html" data-type="entity-link" >CartItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CartItem-1.html" data-type="entity-link" >CartItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CategoriaEntrada.html" data-type="entity-link" >CategoriaEntrada</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CategoriaEntrada-1.html" data-type="entity-link" >CategoriaEntrada</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cliente.html" data-type="entity-link" >Cliente</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cliente-1.html" data-type="entity-link" >Cliente</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cliente-2.html" data-type="entity-link" >Cliente</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CodigosPromocionalesListResponse.html" data-type="entity-link" >CodigosPromocionalesListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CodigosPromocionalesResponse.html" data-type="entity-link" >CodigosPromocionalesResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Compra.html" data-type="entity-link" >Compra</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CrearEventoRequest.html" data-type="entity-link" >CrearEventoRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CrearEventoResponse.html" data-type="entity-link" >CrearEventoResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CrearLocalRequest.html" data-type="entity-link" >CrearLocalRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-1.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-2.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-3.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-4.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-5.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-6.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-7.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-8.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-9.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-10.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-11.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-12.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-13.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-14.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-15.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Datum.html" data-type="entity-link" >Datum</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteLocalResponse.html" data-type="entity-link" >DeleteLocalResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Departamento.html" data-type="entity-link" >Departamento</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/departamentoResponse.html" data-type="entity-link" >departamentoResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Distrito.html" data-type="entity-link" >Distrito</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/distritoResponse.html" data-type="entity-link" >distritoResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DropdownOption.html" data-type="entity-link" >DropdownOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditarClienteBody.html" data-type="entity-link" >EditarClienteBody</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EliminaCodigoPromocionalResponse.html" data-type="entity-link" >EliminaCodigoPromocionalResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EliminaEntradaResponse.html" data-type="entity-link" >EliminaEntradaResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EliminaEventoResponse.html" data-type="entity-link" >EliminaEventoResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EliminarLocalResponse.html" data-type="entity-link" >EliminarLocalResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EliminaZonaResponse.html" data-type="entity-link" >EliminaZonaResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EntradaAgregada.html" data-type="entity-link" >EntradaAgregada</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EntradaAgregada-1.html" data-type="entity-link" >EntradaAgregada</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EntradaResponse.html" data-type="entity-link" >EntradaResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EntradaResponseArray.html" data-type="entity-link" >EntradaResponseArray</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ErrorInfo.html" data-type="entity-link" >ErrorInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EstadoOption.html" data-type="entity-link" >EstadoOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EstadoOption-1.html" data-type="entity-link" >EstadoOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Evento.html" data-type="entity-link" >Evento</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Evento-1.html" data-type="entity-link" >Evento</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Factura.html" data-type="entity-link" >Factura</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FacturaCabecera.html" data-type="entity-link" >FacturaCabecera</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GestionClientesAdmiResponse.html" data-type="entity-link" >GestionClientesAdmiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GestionClientesListResponse.html" data-type="entity-link" >GestionClientesListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HistorialPuntosResponse.html" data-type="entity-link" >HistorialPuntosResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LimiteCompra.html" data-type="entity-link" >LimiteCompra</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LimiteCompra-1.html" data-type="entity-link" >LimiteCompra</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListarLocalesResponse.html" data-type="entity-link" >ListarLocalesResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Local.html" data-type="entity-link" >Local</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocalResponse.html" data-type="entity-link" >LocalResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginResponse.html" data-type="entity-link" >LoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Membership.html" data-type="entity-link" >Membership</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MenuElemento.html" data-type="entity-link" >MenuElemento</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MessageConfig.html" data-type="entity-link" >MessageConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MovimientoPuntos.html" data-type="entity-link" >MovimientoPuntos</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PerfilAdministradorResponse.html" data-type="entity-link" >PerfilAdministradorResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PerfilPersonalResponse.html" data-type="entity-link" >PerfilPersonalResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Provincia.html" data-type="entity-link" >Provincia</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/provinciaResponse.html" data-type="entity-link" >provinciaResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Punto.html" data-type="entity-link" >Punto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PurchaseData.html" data-type="entity-link" >PurchaseData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegistroResponse.html" data-type="entity-link" >RegistroResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegistroUsuario.html" data-type="entity-link" >RegistroUsuario</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TicketForCart.html" data-type="entity-link" >TicketForCart</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TicketType.html" data-type="entity-link" >TicketType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TipoConcierto.html" data-type="entity-link" >TipoConcierto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TipoDocumento.html" data-type="entity-link" >TipoDocumento</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TipoDocumento-1.html" data-type="entity-link" >TipoDocumento</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TipoEntrada.html" data-type="entity-link" >TipoEntrada</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TipoEntrada-1.html" data-type="entity-link" >TipoEntrada</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Usuario.html" data-type="entity-link" >Usuario</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ZonaCategoriaResponse.html" data-type="entity-link" >ZonaCategoriaResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ZonaConTickets.html" data-type="entity-link" >ZonaConTickets</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});