;(function (ng) {
  "use strict";

  const TEMPLATE = `
  <div class="modal fade"
    id="alt-importacao-csv-modal"
    role="dialog"
    aria-hidden="true">

    <div class="modal-dialog modal-lg modal-xl-custom">
      <div class="modal-content">

        <div class="modal-header alt-cor-principal">
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
          </button>

          <h3 class="modal-title">
            {{!importacaoCsvCtrl.visualizacao ? 'Nova' : 'Detalhes da'}}
            importação - <span>{{importacaoCsvCtrl.labelTipo}}</span></h3>
        </div>
        <div class="alt-importacao-csv-wizard-menu">
          <div class="modal-body" ng-hide="importacaoCsvCtrl.visualizacao">
            <div class="row">
              <div ng-repeat="step in importacaoCsvCtrl.steps" class="col-xs-3 text-center alt-importacao-csv-step-title-wrap" ng-hide="step.menuHidden">
                <div class="row">
                  <div class="col-xs-12">
                    <button type="button" class="alt-importacao-csv-step-title" 
                      ng-class="{
                        'alt-importacao-csv-step-title-completed': step.completed, 
                        'alt-importacao-csv-step-title-active': step.active,
                        'alt-importacao-csv-step-title-invalid': !step.valid}">
                        {{step.number}}
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-12 alt-importacao-csv-step-subtitle"
                    ng-class="{
                      'alt-importacao-csv-step-subtitle-completed': step.completed, 
                      'alt-importacao-csv-step-subtitle-active': step.active,
                      'alt-importacao-csv-step-subtitle-invalid': !step.valid}">
                    <span class="text-uppercase text-center">{{step.name}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 alt-importacao-csv-progress-wrapper">
                <uib-progressbar class="progress-striped" value="importacaoCsvCtrl.progress" type="info">
                </uib-progressbar>
              </div>
            </div>
            
            <!--
            <div class="row">
              <div class="col-xs-12 alt-espacamento-top text-center alt-importacao-csv-file-label">
                <span ng-show="!!importacaoCsvCtrl.arquivo">{{importacaoCsvCtrl.arquivo.nome}}</span>
              </div>
            </div>
            -->

          </div>
          
          <!--
          <div class="modal-body" ng-show="importacaoCsvCtrl.visualizacao">
            <div class="row">
              <div class="col-xs-12">
                {{importacaoCsvCtrl.lote.nomeArquivo}} - {{importacaoCsvCtrl.lote.itens.length - importacaoCsvCtrl.lote.erros}} de {{importacaoCsvCtrl.lote.itens.length}} linha(s) importada(s)
              </div>
            </div>
          </div>
          -->

        </div>
        <div class="alt-importacao-csv-wrapper">
          <div ng-show="importacaoCsvCtrl.steps[0].active"
            class="alt-importacao-csv-wizard-step">
            <div class="modal-body">
              <form name="importacaoCsvCtrl.formStepOne">
                <div class="row">
                  <div class="col-xs-12">
                    <div class="alt-importacao-csv-wizard-title" ng-bind="importacaoCsvCtrl.getTitle()"></div>
                    <p class="alt-importacao-csv-wizard-obs alt-espacamento-top" ng-bind-html="importacaoCsvCtrl.getMessage()"><p>
                    <div class="alt-espacamento-top clearfix">
                        <div class="col-xs-12 col-sm-4 col-sm-offset-4 anexos-input-file-escondido-container text-center">
                          <button type="button" class="btn btn-block btn-default alt-espacamento-bottom alt-espacamento-top anexos-input-file-fake">
                            Selecionar arquivo
                          </button>

                          <input type="file" class="anexos-input-file-real alt-hand ng-isolate-scope" 
                            ng-model="importacaoCsvCtrl.arquivo" 
                            id="alt-importacao-csv-input-file-step1"
                            accept=".xls,.xlsx,.csv,.ods"
                            alt-importacao-csv-leitor
                            data-opts="importacaoCsvCtrl.arquivoOpcoes"
                            ng-change="importacaoCsvCtrl.arquivoAlterado()"
                            required>
                        </div>
                    </div>
                    <div class="text-center">
                        <span ng-show="importacaoCsvCtrl.arquivo.valido" class="text-success alt-importacao-csv-input-ckeck">
                          <i class="fa fa-check-circle"></i>&nbsp; {{importacaoCsvCtrl.arquivo.nome}}
                        </span>
                        <span ng-show="!!importacaoCsvCtrl.arquivo && !importacaoCsvCtrl.arquivo.valido" 
                          class="text-danger alt-importacao-csv-input-ckeck">
                          <i class="fa fa-times-circle"></i>&nbsp; {{importacaoCsvCtrl.arquivo.mensagem}}
                        </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div ng-show="importacaoCsvCtrl.steps[1].active"
            class="alt-importacao-csv-wizard-step">
            <div class="modal-body">
              <div class="row">
                <div class="col-xs-12">
                  <div class="alt-importacao-csv-wizard-title" ng-bind="importacaoCsvCtrl.getTitle()"></div>
                  <div class="alt-espacamento-bottom" ng-bind-html="importacaoCsvCtrl.getMessage()"></div>
                </div>
              </div>
 
              <div class="row">
                <div class="col-xs-12 alt-espacamento-top">
                  <div class="alt-importacao-csv-planilha-mapeamento">
                    <table class="table">
                      <thead>
                        <tr>
                          <th ng-repeat="coluna in importacaoCsvCtrl.importacao.colunas" ng-class="{'alt-importacao-csv-coluna-possui-campo-mapeado': !!coluna.campos && coluna.campos.length}">
                            <select class="alt-importacao-csv-select-field"
                              name="field"
                              data-placeholder="Selecione"
                              ng-model="coluna.campoSelecionado"
                              ng-change="importacaoCsvCtrl.vincular(coluna.campoSelecionado, coluna.numero)"
                              ng-options="campo.chave as campo.nome for campo in importacaoCsvCtrl.importacao.campos | filter: importacaoCsvCtrl.campoNaoMapeado track by campo.chave">
                              <option value=""></option>
                            </select>
                          </th>
                        </tr>
                      </thead>
                      <thead>
                        <tr>
                          <th ng-repeat="coluna in importacaoCsvCtrl.importacao.colunas" ng-class="{'alt-importacao-csv-coluna-possui-campo-mapeado': !!coluna.campos && coluna.campos.length}">
                            <span class="small"><i ng-show="coluna.campos.length == 0">Nenhum campo selecionado</i></span>

                            <div ng-repeat="c in coluna.campos" class="alt-importacao-csv-lb-campo-mapeado">
                              <b>{{c.nome}}</b>
                              <span ng-click="importacaoCsvCtrl.desvincular(c.chave)" title="Desvincular">
                                <i class="fa fa-times"></i>
                              </span>
                            </div>

                          </th>
                        </tr>
                      </thead>
                      <tbody class="cabecalho-planilha" ng-show="importacaoCsvCtrl.arquivoOpcoes.colunasPossuemTitulos">
                        <tr>
                          <td ng-repeat="coluna in importacaoCsvCtrl.importacao.colunas">
                            {{coluna.nome}}
                          </td>
                        </tr>
                      </tbody>
                      <tbody>
                        <tr ng-repeat="linha in importacaoCsvCtrl.arquivo.linhas">
                          <td ng-repeat="coluna in importacaoCsvCtrl.arquivo.colunas track by $index" ng-class="{'alt-importacao-csv-coluna-possui-campo-mapeado': !!importacaoCsvCtrl.importacao.colunas[$index].campos && importacaoCsvCtrl.importacao.colunas[$index].campos.length}">
                            {{linha[coluna]}}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-xs-12 alt-espacamento-bottom">
                  <label class="alt-hand alt-espacamento-top" ng-show="importacaoCsvCtrl.arquivo.linhas.length > 1">
                    <input type="checkbox"
                        ng-model="importacaoCsvCtrl.arquivoOpcoes.colunasPossuemTitulos"/>
                    <span class="alt-checkbox"></span> <span class="alt-checkbox-label">Primeira linha do arquivo são títulos das colunas</span>
                  </label>
                </div> 
              </div>

              <div class="row">
                <div class="col-xs-12 alt-importacao-csv-map-warnings">
                  <p ng-repeat="campo in importacaoCsvCtrl.importacao.campos" ng-if="campo.vinculoRequisitado">
                    <i class="fa fa-exclamation-triangle"></i> 
                    <span>O campo <b>{{campo.nome}}</b> do ERP4ME deve ser vinculado a uma coluna do arquivo.</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
          <div ng-show="importacaoCsvCtrl.steps[2].active"
            class="alt-importacao-csv-wizard-step">
            <div class="modal-body">
              <div class="row">
                <div class="col-xs-12">
                  <div class="alt-importacao-csv-wizard-title" ng-bind="importacaoCsvCtrl.getTitle()"></div>
                  <div class="alt-espacamento-bottom" ng-bind-html="importacaoCsvCtrl.getMessage()"></div>
                </div>
              </div>
              <!--
              <div class="row alt-espacamento-bottom">
                <div class="col-md-12 alt-espacamento-bottom">
                  <div class="btn-group" data-toggle="buttons" id="alt-importacao-csv-btn-group-rules">
                    <label class="btn btn-default text-secondary" ng-click="importacaoCsvCtrl.resumoRegrasDeValor.exibir = 'todos';" >
                      <input type="radio" name="toggleRulesMenu" autocomplete="off">
                      {{importacaoCsvCtrl.resumoRegrasDeValor.valores}} valores
                    </label>
                    <label class="btn btn-default text-success" 
                      ng-show="importacaoCsvCtrl.resumoRegrasDeValor.vinculados > 0"
                      ng-click="importacaoCsvCtrl.resumoRegrasDeValor.exibir = 'regras';">
                      <input type="radio" name="toggleRulesMenu" id="menu1" autocomplete="off">
                      <i class="fa fa-check-circle"></i>&nbsp; {{importacaoCsvCtrl.resumoRegrasDeValor.vinculados}} regras
                    </label>
                    <label class="btn btn-default text-warning" 
                      ng-show="importacaoCsvCtrl.resumoRegrasDeValor.nulosInvalidos > 0"
                      ng-click="importacaoCsvCtrl.resumoRegrasDeValor.exibir = 'nulosInvalidos';" >
                      <input type="radio" name="toggleRulesMenu" id="menu2" autocomplete="off">
                      <i class="fa fa-exclamation-circle"></i>&nbsp; {{importacaoCsvCtrl.resumoRegrasDeValor.nulosInvalidos}} valores obrigatórios sem regra
                    </label>
                    <label class="btn btn-default" 
                      ng-show="importacaoCsvCtrl.resumoRegrasDeValor.nulosValidos > 0"
                      ng-click="importacaoCsvCtrl.resumoRegrasDeValor.exibir = 'nulosValidos';">
                      <input type="radio" name="toggleRulesMenu" id="menu3" autocomplete="off">
                      <i class="fa fa-info-circle text-secondary"></i>&nbsp; {{importacaoCsvCtrl.resumoRegrasDeValor.nulosValidos}} valores opcionais sem regra
                    </label>
                  </div>
                </div>
              </div>
              -->
              <div class="row alt-espacamento-top">
                <div class="col-xs-12 alt-importacao-csv-rules-field" 
                  ng-repeat="campo in importacaoCsvCtrl.importacao.campos track by campo.chave" 
                  ng-if="campo.tipo.name === 'Object'"
                  ng-hide="
                    (importacaoCsvCtrl.resumoRegrasDeValor.exibir === 'regras' && campo.resumoRegrasDeValor.vinculados === 0) ||
                    (importacaoCsvCtrl.resumoRegrasDeValor.exibir === 'nulosInvalidos' && campo.resumoRegrasDeValor.nulosInvalidos === 0) ||
                    (importacaoCsvCtrl.resumoRegrasDeValor.exibir === 'nulosValidos' && campo.resumoRegrasDeValor.nulosValidos === 0)">
                  <div class="row alt-espacamento-top">
                    <div class="col-xs-12">
                      <label ng-show="importacaoCsvCtrl.obterQtdCamposRegras(importacaoCsvCtrl.importacao.campos) > 1" class="alt-importacao-csv-rules-title" data-toggle="collapse" data-target="#alt-importacao-csv-rules-field-{{campo.chave}}">
                        <i class="fa fa-angle-down"></i>
                        {{campo.nome}} 
                        <span ng-show="!!campo.coluna && importacaoCsvCtrl.arquivoOpcoes.colunasPossuemTitulos">(coluna {{importacaoCsvCtrl.nomeColuna(campo.coluna)}})</span>
                      </label>
                      <label ng-hide="importacaoCsvCtrl.obterQtdCamposRegras(importacaoCsvCtrl.importacao.campos) > 1"  class="alt-importacao-csv-rules-title no-alt-hand">
                        {{campo.nome}} 
                        <span ng-show="!!campo.coluna && importacaoCsvCtrl.arquivoOpcoes.colunasPossuemTitulos">(coluna {{importacaoCsvCtrl.nomeColuna(campo.coluna)}})</span>
                      </label>
                    </div>
                  </div>
                  <div class="row alt-espacamento-bottom collapse in" id="alt-importacao-csv-rules-field-{{campo.chave}}">
                    <div class="col-xs-12 alt-importacao-csv-rule-table">
                      <table class="table table-responsive table-condensed table-striped">
                        <thead>
                          <tr>
                            <th class="status"></th>
                            <th>Informação arquivo</th>
                            <th>Ocorrências</th>
                            <th>Informação ERP4ME</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr ng-repeat="regra in campo.regrasDeValor"
                            ng-class="{
                              'rule-success': regra.objeto,
                              'rule-warning': !regra.objeto && !campo.obrigatorio,
                              'rule-error': !regra.objeto && campo.obrigatorio}"
                            ng-hide="
                              (!regra.objeto && importacaoCsvCtrl.resumoRegrasDeValor.exibir === 'regras') ||
                              ((!regra.objeto && campo.obrigatorio || regra.objeto) && importacaoCsvCtrl.resumoRegrasDeValor.exibir === 'nulosValidos') ||
                              ((!regra.objeto && !campo.obrigatorio || regra.objeto) && importacaoCsvCtrl.resumoRegrasDeValor.exibir === 'nulosInvalidos')">
                            <td class="status">
                              <i class="fa fa-exclamation-triangle text-warning" ng-show="!regra.objeto && campo.obrigatorio"></i>
                              <i class="fa fa-check text-success" ng-show="regra.objeto"></i>
                            </td>
                            <td ng-hide="regra.geral">{{regra.valor}}</td>
                            <td ng-show="regra.geral"><i class="text-secondary">Todas as ocorrências</i></td>
                            <td class="alt-importacao-csv-rules-td-count-field">{{regra.quantidade}}</td>
                            <td class="alt-importacao-csv-rules-td-select-field">
                              <select id="alt-importacao-csv-rules-select-{{campo.chave}}-{{$index}}"
                                class="alt-importacao-csv-rules-select"
                                style="width: 100%;"
                                ng-model="regra.objeto"
                                ng-change="importacaoCsvCtrl.resumirRegrasDeValor()"
                                ng-options="{{importacaoCsvCtrl.ngOptionsRegraDeCampo(campo)}}">
                              </select>
                            </td>
                            <td class="alt-importacao-csv-rules-td-actions-field">
                              <button type="button" class="btn btn-default pull-right" 
                                ng-disabled="!regra.objeto"
                                ng-click="importacaoCsvCtrl.limparRegra(campo, $index)">
                                Limpar
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div ng-show="importacaoCsvCtrl.steps[3].active"
            class="alt-importacao-csv-wizard-step alt-espacamento-bottom">
            <div class="modal-body">
              <div class="row alt-espacamento-bottom">
                <div class="col-xs-12">
                  <div class="alt-importacao-csv-wizard-title" ng-if="!importacaoCsvCtrl.visualizacao" ng-bind="importacaoCsvCtrl.getTitle()"></div>
                  <div class="alt-espacamento-bottom"  ng-bind-html="importacaoCsvCtrl.getMessage()"></div>
                </div>
              </div>
              <div class="row alt-espacamento-bottom">
                <div class="col-md-12 alt-espacamento-bottom">
                  <div class="btn-group" data-toggle="buttons" id="alt-importacao-csv-btn-group-review">
                    <label class="btn btn-default text-secondary" ng-click="importacaoCsvCtrl.lote.exibir = 'todos';" >
                      <input type="radio" name="toggleRulesMenu" autocomplete="off">
                      {{importacaoCsvCtrl.lote.itens.length}} linhas
                    </label>
                    <label class="btn btn-default text-success"
                      ng-show="importacaoCsvCtrl.lote.validos > 0"
                      ng-click="importacaoCsvCtrl.lote.exibir = 'validos';">
                      <input type="radio" name="toggleLoteMenu" id="menuLote1" autocomplete="off">
                      <span ng-hide="importacaoCsvCtrl.visualizacao"><i class="fa fa-check-circle"></i>&nbsp; {{importacaoCsvCtrl.lote.validos}} válidas</span>
                      <span ng-show="importacaoCsvCtrl.visualizacao"><i class="fa fa-check-circle"></i>&nbsp; {{importacaoCsvCtrl.lote.validos}} importadas com sucesso</span>
                    </label>
                    <label class="btn btn-default" 
                      ng-show="importacaoCsvCtrl.lote.conflitos > 0"
                      ng-click="importacaoCsvCtrl.lote.exibir = 'conflitos';">
                      <input type="radio" name="toggleLoteMenu" id="menuLote3" autocomplete="off">
                      <span ng-hide="importacaoCsvCtrl.visualizacao"><i class="fa fa-exclamation-circle text-secondary"></i>&nbsp; {{importacaoCsvCtrl.lote.conflitos}} com aviso</span>
                      <span ng-show="importacaoCsvCtrl.visualizacao"><i class="fa fa-check-circle text-secondary"></i>&nbsp; {{importacaoCsvCtrl.lote.conflitos}} importadas com aviso</span>
                    </label>
                    <label class="btn btn-default text-danger" 
                      ng-show="importacaoCsvCtrl.lote.erros > 0"
                      ng-click="importacaoCsvCtrl.lote.exibir = 'erros';" >
                      <input type="radio" name="toggleLoteMenu" id="menuLote2" autocomplete="off">
                      <i class="fa fa-times-circle"></i>&nbsp; {{importacaoCsvCtrl.lote.erros}} com erro
                    </label>
                    <label class="btn btn-default" 
                      ng-show="importacaoCsvCtrl.lote.desconsiderados > 0"
                      ng-click="importacaoCsvCtrl.lote.exibir = 'desconsiderados';">
                      <input type="radio" name="toggleLoteMenu" id="menuLote4" autocomplete="off">
                      <i class="fa fa-info-circle text-secondary"></i>&nbsp; {{importacaoCsvCtrl.lote.desconsiderados}} não importado(s)
                    </label>
                  </div>
                </div>
              </div>

              <div class="alt-sombra-secundaria">
                <div class=""
                  ng-repeat="item in importacaoCsvCtrl.lote.itens | filter: importacaoCsvCtrl.localizarRegistro"
                  ng-hide="
                    ((item.possuiErro || item.possuiConflito || item.desconsiderado) && importacaoCsvCtrl.lote.exibir === 'validos') || 
                    ((!item.possuiErro || item.desconsiderado) && importacaoCsvCtrl.lote.exibir === 'erros') || 
                    ((!item.possuiConflito || item.desconsiderado) && importacaoCsvCtrl.lote.exibir === 'conflitos') ||
                    (item.desconsiderado !== true && importacaoCsvCtrl.lote.exibir === 'desconsiderados')">
                  
                  <div class="">
                    
                    <div class="alt-importacao-csv-report"
                      ng-class="{
                        'alt-importacao-csv-report--error': item.possuiErro,
                        'alt-importacao-csv-report--warning': item.possuiConflito,
                        'alt-importacao-csv-report--disabled': item.desconsiderado}">
                      
                      <!--
                      <div class="row">
                        <div class="col-md-12 alt-importacao-csv-report-row-head">
                          <span ng-class="{'text-success': !item.possuiErro, 'text-danger': item.possuiErro}">Registro {{item.linha}}</span>
                          <button class="btn btn-default pull-right" ng-show="!importacaoCsvCtrl.visualizacao && !item.desconsiderado" ng-click="importacaoCsvCtrl.lote.desconsiderarItem($index)">Não importar</button>
                          <button class="btn btn-default pull-right" ng-show="!importacaoCsvCtrl.visualizacao && item.desconsiderado" ng-click="importacaoCsvCtrl.lote.considerarItem($index)">Importar</button>
                          <button class="btn btn-default pull-right" ng-show="true || importacaoCsvCtrl.visualizacao && !!item.idObjeto && !!item.editar" ng-click="importacaoCsvCtrl.editarObjeto(item)">Editar {{importacaoCsvCtrl.labelTipoSingular}}</button>
                        </div>
                      </div>
                      -->

                      <div class="alt-importacao-csv-report-row-body row-body-{{ $index % 2 === 0 ? 'par' : 'impar' }}">
                        
                        <!-- 
                        <div ng-repeat="campo in item.resumo.campos" class="col-md-{{campo.template.width}}">
                          <label ng-bind="campo.template.label"></label>
                            <span ng-show="campo.valido" ng-bind="campo.referencia"></span>
                            <span ng-hide="campo.valido">
                              {{campo.dado}} <i class="fa fa-times-circle text-danger"></i>
                            </span>
                        </div> 
                        -->

                        <div class="row" ng-if="$first">
                          <div ng-repeat="campo in importacaoCsvCtrl.camposOrdenados" class="col-md-{{ campo.template.width }} alt-importacao-csv-report-title">{{ campo.nome }}</div>
                          <div class="col-md-1 alt-importacao-csv-report-title text-center">Status</div>
                          <div class="col-md-1 alt-importacao-csv-report-title">&nbsp;</div>
                        </div>

                        <div class="row">
                          <div ng-repeat="campo in importacaoCsvCtrl.camposOrdenados" class="col-md-{{ campo.template.width }} alt-importacao-csv-report-row">{{ importacaoCsvCtrl.obterValorCampoProp(item.objeto, campo.tplProp) }}</div>
                          <div class="col-md-1 alt-importacao-csv-report-row text-center" ng-switch="item.processado">
                            <i ng-switch-default class="fa fa-clock-o" aria-hidden="true"></i>
                            <i ng-switch-when="1" class="fa fa-check-circle text-success" aria-hidden="true"></i>
                            <i ng-switch-when="2" class="fa fa-times-circle text-danger" aria-hidden="true"></i>
                          </div>
                          <div class="col-md-1 alt-importacao-csv-report-row" ng-init="item.collapse = true"><button class="btn btn-sm btn-default pull-right" ng-click="item.collapse = !item.collapse"><i ng-class="{'fa fa-angle-down': item.collapse, 'fa fa-angle-up': !item.collapse }"></i></button></div>
                        </div>
                        
                        <div ng-show="!item.collapse" class="alt-importacao-csv-report-row-detalhes">
                        
                          <div class="row">
                            <div class="col-md-12 alt-importacao-csv-report-row-head">
                              <span ng-class="{'text-success': !item.possuiErro, 'text-danger': item.possuiErro}">Registro {{item.linha}}</span>
                              <button class="btn btn-default pull-right" ng-show="importacaoCsvCtrl.visualizacao && !!item.idObjeto && !!item.editar" ng-click="importacaoCsvCtrl.editarObjeto(item)">Editar</button>
                              <!-- <button class="btn btn-default pull-right" ng-click="item.collapse = !item.collapse"><span aria-hidden="true">×</span></button> -->
                            </div>
                          </div>

                          <hr>
              
                          <div class="row">
                            <div class="col-xs-12" ng-repeat="campo in importacaoCsvCtrl.campos" >
                              <strong>{{ campo.nome }}: </strong><span>{{ importacaoCsvCtrl.obterValorCampoProp(item.objeto, campo.tplProp) }}</span>
                            </div>
                          </div>

                        </div>

                      </div>
                      <div class="row" ng-show="item.resumo.mensagens.length > 0">
                        <div class="col-md-12 alt-importacao-csv-report-row-footer">
                          <div class="alt-importacao-csv-report-message" ng-repeat="msg in item.resumo.mensagens">
                            <i class="fa fa-exclamation-triangle text-warning"></i>&nbsp;
                            <span ng-show="!!msg.erroImportacao"><b>Erro ao importar:</b></span>
                            <span ng-bind-html="msg.textoHtml" ng-show="!!msg.textoHtml"></span>
                            <span ng-bind="msg.texto" ng-show="!msg.textoHtml"></span>
                          </div>
                        </div>
                      </div>
                    
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
        <div class="modal-footer" ng-hide="importacaoCsvCtrl.visualizacao">
          <button type="button" class="btn btn-default pull-left" 
            ng-click="importacaoCsvCtrl.prevStep()"
            ng-hide="importacaoCsvCtrl.steps[0].active">
            <i class="fa fa-long-arrow-left"></i>&nbsp; Anterior
          </button>
          
          <!--
          <div class="anexos-input-file-escondido-container anexos-input-file-escondido-container-inline" ng-show="importacaoCsvCtrl.permiteAlteracaoArquivo()">
            <button type="button" class="col-xs-12 btn btn-default anexos-input-file-fake">
              <span><i class="fa fa-refresh"></i>&nbsp; Recarregar arquivo</span>
            </button>
            <input type="file" class="anexos-input-file-real alt-hand col-xs-12 ng-isolate-scope" 
                ng-model="importacaoCsvCtrl.arquivo"
                accept=".xls,.xlsx,.csv,.ods"
                name="file"
                alt-importacao-csv-leitor
                ng-change="importacaoCsvCtrl.arquivoAlterado()"
                required>
          </div>
          -->

          <button type="button" class="btn btn-primary"
            ng-hide="importacaoCsvCtrl.steps[2].active"
            ng-disabled="importacaoCsvCtrl.invalidStep()"
            ng-click="importacaoCsvCtrl.nextStep()">
            Próximo &nbsp;<i class="fa fa-long-arrow-right"></i>
          </button>
          <button type="button" class="btn btn-primary"
            ng-show="importacaoCsvCtrl.steps[2].active"
            ng-disabled="importacaoCsvCtrl.invalidStep()"
            ng-click="importacaoCsvCtrl.salvarImportacao()">
            Importar
          </button>
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
        </div>
        <div class="modal-footer" ng-show="importacaoCsvCtrl.visualizacao">
          <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
        </div>
      </div>
    </div>
  </div>`;

  ng.module('alt.importacao-csv')
    .service('AltImportacaoCsvEspecificaService', ['$rootScope', 'AltImportacaoCsvEvento', function ($rootScope, evento) {
      this.exibe = function (opcoes) {
        $rootScope.$broadcast(evento.modal.ABRE_MODAL_IMPORTACAO_ESPECIFICA, opcoes);
      };
    }])
    .directive('altImportacaoCsvEspecifica', [function () {
      var _scope = {};
      var _restrict = 'A';
      var _replace = true;

      var _controller = [
        '$rootScope',
        '$scope',
        '$sce',
        '$timeout',
        'AltModalService',
        'AltSelectService',
        'AltAlertaFlutuanteService',
        'AltImportacaoCsvCampoModel',
        'AltImportacaoCsvLoteModel',
        'AltImportacaoCsvModel',
        'AltImportacaoCsvEvento',
        function($rootScope, $scope, $sce, $timeout, modalService, selectService, alertaService, Campo, Lote, Importacao, evento) {
        var self = this;

        const ID_MODAL = '#alt-importacao-csv-modal';
        // const ID_SELECT_COLUNAS = '#alt-importacao-csv-select-column';
        const ID_COMUM_SELECTS_REGRAS = '#alt-importacao-csv-rules-select';
        const ID_MENU_REGRAS_DE_VALOR = '#alt-importacao-csv-btn-group-rules';
        // const ID_MENU_REVISAO = '#alt-importacao-csv-btn-group-review';
        // const CLASS_BODY_WRAPPER = '.alt-importacao-csv-wrapper';
        const CLASS_SELECT_CAMPOS = '.alt-importacao-csv-select-field';

        var _ativarEstacaoMenu = function(idMenu, posicao) {
          var btns = $(idMenu).find('input[type="radio"]');
          btns.removeAttr('checked');
          btns.parent('label').removeClass('active');
          $(btns[posicao]).attr('checked', 'checked');
          $(btns[posicao]).parent('label').addClass('active');
        };

        var _inicializarMapeamento = function() {
          if (!!self.importacao) {
            // roda quando o valor de arquivoOpcoes.colunasPossuemTitulos é alternado
            // atualizando apenas o nome do titulo da coluna e mantendo todo o restante dos dados
            self.arquivo.colunas.map((col, i) => {
              self.importacao.colunas[i].nome = col;
            });

            self.arquivoAnterior = ng.copy(self.arquivo);
          } else {
            self.importacao = new Importacao(self.campos);

            self.arquivo.colunas.map((col, i) => {
              self.importacao.adicionarColuna(col, i);
            });
          }

          self.importacao.validarMapa();

          selectService.inicializar(CLASS_SELECT_CAMPOS);
          // selectService.inicializar(ID_SELECT_COLUNAS);
        };

        var _inicializarRegras = function() {
          self.resumoRegrasDeValor = self.importacao.aplicarRegrasDeValor(self.arquivo.linhas);

          self.importacao.campos.forEach((campo) => {
            if (campo.tipo === Object) {
              campo.regrasDeValor.forEach((regra, index) => {
                var id = ID_COMUM_SELECTS_REGRAS + '-' + campo.chave + '-' + index;
                if (!!campo.objetoCriarNovo) {
                  self.inicializarComboComOpcaoCriarNovo(id, campo.chave, index);
                }
                else {
                  selectService.inicializar(id);
                }
              });
            }
          });

          self.resumoRegrasDeValor.exibir = 'todos';
          _ativarEstacaoMenu(ID_MENU_REGRAS_DE_VALOR, 0);
        };

        /* var _inicializarRevisao = function() {
          var loteProvisorio = self.importacao.montarLote(self.arquivo.linhas, self.arquivo.nome, self.lote);
          self.validarLote(loteProvisorio).then((lote) => {
            self.lote = lote;
            self.lote.exibir = 'todos';
            _ativarEstacaoMenu(ID_MENU_REVISAO, 0);
          });
        }; */

        var _visualizarProcessado = function(lote) {
          self.visualizacao = true;
          self.steps[0].active = false;
          self.steps[3].active = true;

          lote.itens.forEach((item) => {
            if (!!item.resumo && item.resumo.mensagens) {
              item.resumo.mensagens.forEach((msg) => {
                if (msg.textoHtml) {
                  msg.textoHtml = $sce.trustAsHtml(msg.textoHtml);
                }
              });
            }
          });

          self.lote = new Lote(lote);
          self.lote.resumir();

          let dataProcessado = !!lote.dataProcessado ? moment(lote.dataProcessado, 'DD/MM/YYYY').format('LLL') : null;
          let textoDataProcessado = (dataProcessado ? 'processado em ' + dataProcessado : 'processado');
          let texto = `
            <div class="row">
              <div class="col-md-6">
                <span class="small text-muted">arquivo: </span> ${self.lote.nomeArquivo}
              </div>
              <div class="col-md-6">
              <span class="small text-muted">status: </span> ${(self.lote.status > 0 ? textoDataProcessado : 'processando')}
              </div>
            </div>
            <hr style="margin-top: 15px; margin-bottom: 10px;">
          `;

          self.steps[3].message = $sce.trustAsHtml(texto);
        };

        var _inicializar = function(opcoes) {
          self.labelTipo = opcoes.labelTipo;
          self.labelTipoSingular = opcoes.labelTipoSingular;
          self.validarLote = opcoes.validarLote;
          self.gravarLote = opcoes.gravarLote;
          self.eventoCriacao = opcoes.eventoCriacao;
          self.campos = ng.copy(opcoes.campos);
          self.camposConfigurados = ng.copy(opcoes.campos);

          self.arquivoAnterior = null;
          self.arquivo = null;
          self.arquivoOpcoes = {
            colunasPossuemTitulos: false
          };
          self.colunasSelecao = null;
          self.lote = null;
          self.visualizacao = false;
          self.importacao = undefined;
          self.resumoRegrasDeValor = undefined;

          self.steps = [
            {
              name: 'Passo 1',
              number: 1,
              active: true,
              progress: 12.6,
              init: null,
              title: 'Importar dados',
              message: $sce.trustAsHtml('Selecione o arquivo para importação com extensão xls, xlsx, ods ou csv')
            },
            {
              name: 'Passo 2',
              number: 2,
              active: false,
              progress: 37.5,
              init: _inicializarMapeamento,
              title: 'Configurar importação',
              message: $sce.trustAsHtml('Selecione o(s) campo(s) do ERP4ME correspondente(s) a cada coluna do arquivo para realizar a importação')
            },
            {
              name: 'Passo 3',
              number: 3,
              active: false,
              progress: 62.5,
              init: _inicializarRegras,
              title: 'Configurar Tipo de pessoa',
              message: $sce.trustAsHtml('Vincule a informação do arquivo ao <em>Tipo de pessoa</em> correspondente no cadastro do ERP4ME')
            },
            {
              name: 'Passo 4',
              number: 4,
              active: false,
              progress: 87.7,
              init: null, // _inicializarRevisao,
              title: '', // 'Importação de ' + self.labelTipo.toLowerCase(),
              message: $sce.trustAsHtml('')
            }
          ];

          self.progress = self.steps[0].progress;
          self.camposOrdenados = self.gerarCamposOrdenadosListaVisualizacao(opcoes.campos);

          if (!!opcoes.visualizacao) {
            _visualizarProcessado(opcoes.loteProcessado);
          }

        };

        self.getTitle = function () {
          if (!self.steps || !self.steps.length) {
            return '';
          }

          return self.steps.find((item) => { return item.active === true; }).title;
        };

        self.getMessage = function () {
          if (!self.steps || !self.steps.length) {
            return '';
          }

          return self.steps.find((item) => { return item.active === true; }).message;
        };

        self.nextStep = function() {
          var current = _.findIndex(self.steps, {active: true});
          var currentStep = self.steps[current];
          var nextStep = self.steps[current + 1];

          currentStep.active = false;
          currentStep.completed = true;
          nextStep.active = true;
          self.progress = nextStep.progress;
          nextStep.init();
        };

        self.prevStep = function() {
          var current = _.findIndex(self.steps, {active: true});
          self.steps[current].active = false;
          self.steps[current].completed = false;
          self.steps[current - 1].active = true;
          self.progress = self.steps[current - 1].progress;
        };

        self.reloadStep = function(index) {
          var step = self.steps[index];
          if (!!step && !!step.init) {
            step.init();
          }
        };

        self.invalidStep = function() {
          var index = _.findIndex(self.steps, {active: true});
          switch (index) {
            case 0:
              return !self.arquivo || !self.arquivo.valido;
            case 1:
              return self.importacao.mapaInvalido;
            case 2:
              return self.resumoRegrasDeValor.nulosInvalidos > 0;
            case 3:
              return self.lote && self.lote.erros !== 0;
            default:
              return false;
          }
        };

        self.vincular = function(campo, coluna) {
          self.importacao.vincular(campo, coluna);
          selectService.inicializar(CLASS_SELECT_CAMPOS);
        };

        self.desvincular = function(campo) {
          self.importacao.desvincular(campo);
          selectService.inicializar(CLASS_SELECT_CAMPOS);
        };

        /* self.deParaDefault = function() {
          self.vincular('cpfCnpj', 1);
          self.vincular('nome', 4);
          self.vincular('nomeFantasia', 7);
          self.vincular('tipo', 8);
          self.vincular('endereco_cep', 10);
          self.vincular('endereco_logradouro', 11);
          self.vincular('endereco_numero', 12);
          self.vincular('endereco_complemento', 13);
          self.vincular('endereco_bairro', 14);
          self.vincular('endereco_cidade', 15);
          self.vincular('endereco_uf', 16);
        }; */

        self.campoNaoMapeado = function(campo) {
          return ng.isUndefined(campo.coluna);
        };

        self.resumirRegrasDeValor = function() {
          ng.extend(self.resumoRegrasDeValor, self.importacao.resumirRegrasDeValor());
          if (self.resumoRegrasDeValor.exibir === 'nulosValidos' && self.resumoRegrasDeValor.nulosValidos === 0) {
            self.resumoRegrasDeValor.exibir = 'todos';
            _ativarEstacaoMenu(ID_MENU_REGRAS_DE_VALOR, 0);
          }
          if (self.resumoRegrasDeValor.exibir === 'nulosInvalidos' && self.resumoRegrasDeValor.nulosInvalidos === 0) {
            self.resumoRegrasDeValor.exibir = 'todos';
            _ativarEstacaoMenu(ID_MENU_REGRAS_DE_VALOR, 0);
          }
        };

        self.permiteAlteracaoArquivo = function() {
          var current = _.findIndex(self.steps, {active: true});
          return current === 2 || current === 3;
        };

        self.arquivoAlterado = function() {
          var index = _.findIndex(self.steps, {active: true});
          var etapaInicial = index === 0;
          var etapaMapa = index === 1;
          var etapaRegras = index === 2;
          var etapaRevisao = index === 3;

          if (!!self.arquivoAnterior && self.arquivoAnterior.nome !== self.arquivo.nome && !etapaInicial) {
            self.arquivo = ng.copy(self.arquivoAnterior);
            return alertaService.exibe({msg: 'O nome do documento deve coincidir com o do arquivo da importação.'});
          }

          if (!!self.arquivoAnterior && self.arquivoAnterior.nome !== self.arquivo.nome) {
            self.importacao = undefined;
          }

          if (etapaInicial && (self.arquivoAnterior ? self.arquivoAnterior.nome !== self.arquivo.nome : false)) {
            self.campos = ng.copy(self.camposConfigurados); // reinicializa campos p/ limpar colunas vinculadas.
          }

          if (etapaMapa) {
            _inicializarMapeamento();
            return;
          }

          if (etapaRegras) {
            self.campos.forEach((campo) => {
              campo.regrasDeValor = undefined; // limpa regras para não serem reaproveitadas, já não se pode garantir a equivalência dos dados.
            });
          }

          if (etapaRevisao) {
            self.lote = undefined; // limpa lote para que não seja reaproveitada informação de linhas desconsideradas.
          }

          self.arquivoAnterior = ng.copy(self.arquivo);
          self.reloadStep(index);
        };

        self.criarNovoObjetoDeRegra = function(chaveCampo, indexRegra) {
          modalService.close(ID_MODAL);
          $timeout(() => {
            var campo = _.find(self.importacao.campos, {chave: chaveCampo});
            if (!!campo.objetoCriarNovo && !!campo.objetoCriarNovo.funcao) {
              campo.objetoCriarNovo.funcao();
              campo.atribuirNovoARegra = indexRegra;

              $scope.$on(campo.objetoCriarNovo.eventoAtualizacao, (ev, objNovo) => {
                if (campo.atribuirNovoARegra !== undefined) {
                  modalService.open(ID_MODAL);

                  $timeout(() => {
                    campo.regrasDeValor[campo.atribuirNovoARegra].objeto = objNovo;
                    var id = ID_COMUM_SELECTS_REGRAS + '-' + campo.chave + '-' + campo.atribuirNovoARegra;
                    self.inicializarComboComOpcaoCriarNovo(id, campo.chave, campo.atribuirNovoARegra);
                    campo.atribuirNovoARegra = undefined;
                    self.resumirRegrasDeValor();
                  }, 200);
                }
              });
            }
          }, 200);
        };

        self.limparRegra = function(campo, indexRegra) {
          var regra = campo.regrasDeValor[indexRegra];
          regra.objeto = undefined;
          var id = ID_COMUM_SELECTS_REGRAS + '-' + campo.chave + '-' + indexRegra;
          if (!!campo.objetoCriarNovo) {
            self.inicializarComboComOpcaoCriarNovo(id, campo.chave, indexRegra);
          }
          else {
            selectService.inicializar(id);
          }
          self.resumirRegrasDeValor();
        };

        self.inicializarComboComOpcaoCriarNovo = function(id, chaveCampo, indexRegra) {
          $timeout(() => {
            selectService.inicializarComOpcaoCriarNovo(id, {
              escopo: $scope,
              strMetodo: `importacaoCsvCtrl.criarNovoObjetoDeRegra('${chaveCampo}', ${indexRegra})`
            }, {});
          });
        };

        self.salvarImportacao = function() {
          // Chamado neste ponto pois Passo 4 foi retirado do fluxo
          // _inicializarRevisao();
          // Trouxe o codigo do metodo _inicializarRevisao, pois preciso executar o restande no retorno da Promise
          var loteProvisorio = self.importacao.montarLote(self.arquivo.linhas, self.arquivo.nome, self.lote);

          self.validarLote(loteProvisorio).then((lote) => {
            self.lote = lote;
            self.lote.exibir = 'todos';

            var lotePersistencia = ng.copy(self.lote);
            // _.remove(lotePersistencia.itens, (item) => {return item.desconsiderado;});

            self.gravarLote(lotePersistencia).then((resp) => {
              self.arquivo = null;

              modalService.close(ID_MODAL);
              $rootScope.$broadcast(self.eventoCriacao, resp);
            });
            return true;
          });
        };

        self.editarObjeto = function(item) {
          if (typeof item.editar === 'function') {
            modalService.close(ID_MODAL);
            item.editar(item.idObjeto, item.objeto);
            $scope.$on(item.eventoEdicaoConcluida, () => {
              modalService.open(ID_MODAL);
            });
          }
        };

        self.nomeColuna = function(numero) {
          var coluna = _.find(self.importacao.colunas, {numero: numero});
          return coluna ? coluna.nome : '';
        };

        self.ngOptionsRegraDeCampo = function(campo) {
          var select = 'obj as obj[campo.objetoReferencia]';
          var from = 'for obj in campo.objetoListagem()';
          var trackBy = 'track by obj[campo.objetoChave]';
          var groupBy = '';
          var orderBy = '';

          if (!!campo.objetoOpcoesListagem.groupBy) {
            groupBy = 'group by obj[campo.objetoOpcoesListagem.groupBy] ';
          }
          if (!!campo.objetoOpcoesListagem.orderBy && $.isArray(campo.objetoOpcoesListagem.orderBy)) {
            orderBy = `| orderBy:[${_.map(campo.objetoOpcoesListagem.orderBy, (str) => { return "'" + str + "'"; }).toString()}]`;
          }

          return `${select} ${groupBy} ${from} ${orderBy} ${trackBy}`;
        };

        self.obterQtdCamposRegras = function (campos) {
          return campos.filter((campo) => {
            return campo.tipo.name === 'Object';
          }).length;
        };

        self.gerarCamposOrdenadosListaVisualizacao = function (campos) {
          let _filtro = campos.filter((campo) => {
            return (campo.exibirNaVisualizacaoListaPosicao > 0);
          });

          return _.sortBy(_filtro, 'exibirNaVisualizacaoListaPosicao');
        };

        self.obterValorCampoProp = function (obj, prop) {
          if (typeof obj === 'undefined') {
            return false;
          }

          let _index = prop.indexOf('.');

          if (_index > -1) {
            return self.obterValorCampoProp(obj[prop.substring(0, _index)], prop.substr(_index + 1));
          }

          return obj[prop];
        };

        $scope.$on(evento.modal.ABRE_MODAL_IMPORTACAO_ESPECIFICA, (ev, opcoes) => {
          _inicializar(opcoes);
          modalService.open(ID_MODAL);
        });
      }];

      return {
        restrict: _restrict,
        replace: _replace,
        template: TEMPLATE,
        scope: _scope,
        controller: _controller,
        controllerAs: 'importacaoCsvCtrl'
      };
    }
  ]);
}(angular));
