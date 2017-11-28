const COMPLETIONS = require('../biocontainers.json')

module.exports =
class CWLProvider {
  constructor() {
    this.selector = '.source.cwl'
    this.disableForSelector = '.comment, .string'
    this.inclusionPriority = 1
    this.suggestionPriority = 2
    this.filterSuggestions = true

    this.showIcon = ['Symbol', 'Subsequence'].includes(atom.config.get('autocomplete-plus.defaultProvider'))
    this.cwlsSource = {
      cwlsForScopes(scopeDescriptor) {
        const scopes = scopeDescriptor.getScopesArray()
        const commonwlurl="http://www.commonwl.org/"
        //
        const symbols_url="http://www.commonwl.org/v1.0/Workflow.html#CWLVersion"
        const symbols_type="const"
        const symbols_description="CWLVersion"
        //
        const suggestAllList = {
          "cwlVersion.cwl":[
            {"value":"draft-2","description":symbols_description,"type":symbols_type,"descriptionMoreURL":symbols_url},
            {"value":"draft-3.dev1","description":symbols_description,"type":symbols_type,"descriptionMoreURL":symbols_url},
            {"value":"draft3-dev2","description":symbols_description,"type":symbols_type,"descriptionMoreURL":symbols_url},
            {"value":"draft3-dev3","description":symbols_description,"type":symbols_type,"descriptionMoreURL":symbols_url},
            {"value":"draft3-dev4","description":symbols_description,"type":symbols_type,"descriptionMoreURL":symbols_url},
            {"value":"draft3-dev5","description":symbols_description,"type":symbols_type,"descriptionMoreURL":symbols_url},
            {"value":"draft3","description":symbols_description,"type":symbols_type,"descriptionMoreURL":symbols_url},
            {"value":"draft4.dev1","description":symbols_description,"type":symbols_type,"descriptionMoreURL":symbols_url},
            {"value":"draft4.dev2","description":symbols_description,"type":symbols_type,"descriptionMoreURL":symbols_url},
            {"value":"draft4.dev3","description":symbols_description,"type":symbols_type,"descriptionMoreURL":symbols_url},
            {"value":"v1.0.dev4","description":symbols_description,"type":symbols_type,"descriptionMoreURL":symbols_url},
            {"value":"v1.0","description":symbols_description,"type":symbols_type,"descriptionMoreURL":symbols_url}
          ],
          "source.cwl":[
          ],
          "support.type.cwl":[
          ],
          "storage.type.cwl":[
          ],
          "dockerPull.cwl":[
          ]
        };
        //
        const keyword_url=""
        const keyword_type="keyword"
        const keyword_description="Keyword"

        const keywordListString = "cwlVersion|inputs|outputs|class|steps|id|requirements|hints|label|doc|secondaryFiles|streamable|outputBinding|format|outputSource|linkMerge|type|glob|loadContents|outputEval|merge_nested|merge_flattened|location|path|basename|dirname|nameroot|nameext|checksum|size|format|contents|listing|fields|symbols|items|in|out|run|scatter|scatterMethod|source|default|valueFrom|expressionLib|types|linkMerge|inputBinding|position|prefix|separate|itemSeparator|valueFrom|shellQuote|packages|package|version|specs|entry|entryname|writable|baseCommand|arguments|stdin|stderr|stdout|successCodes|temporaryFailCodes|permanentFailCodes|dockerPull|dockerLoad|dockerFile|dockerImport|dockerImageId|dockerOutputDirectory|envDef|envName|envValue|coresMin|coresMax|ramMin|ramMax|tmpdirMin|tmpdirMax|outdirMin|outdirMax"
        const keywordList = keywordListString.split("|")
        for(let index in keywordList){
          const value = keywordList[index]
          suggestAllList["source.cwl"].push(
            {"value":value,"description":keyword_description,"type":keyword_type,"descriptionMoreURL":keyword_url}
          )
        }
        //
        const type_url=""
        const type_type="type"
        const type_description="Keyword"

        const typeListString = 'CommandLineTool|ExpressionTool|Workflow|InlineJavascriptRequirement|SchemaDefRequirement|DockerRequirement|SoftwareRequirement|InitialWorkDirRequirement|EnvVarRequirement|ShellCommandRequirement|ResourceRequirement'
        const typeList = typeListString.split("|")
        for(let index in typeList){
          const value = typeList[index]
          suggestAllList["support.type.cwl"].push(
            {"value":value,"description":type_description,"type":type_type,"descriptionMoreURL":keyword_url}
          )
        }
        //
        const storage_type_url=""
        const storage_type_type="type"
        const storage_type_description="Keyword"

        const storage_typeListString = 'null|boolean|int|long|float|double|string|File|Directory'
        const storage_typeList = storage_typeListString.split("|")
        for(let index in storage_typeList){
          const value = storage_typeList[index]
          suggestAllList["storage.type.cwl"].push(
            {"value":value,"description":type_description,"type":type_type,"descriptionMoreURL":keyword_url}
          )
        }
        // dockerPull
        const dockerPull_url=""
        const dockerPull_type="variable"
        const dockerPull_description="Keyword"

        //const dockerPullListString = 'python:2.7.14|debian:jessie|jenkins'
        //const dockerPullList = dockerPullListString.split("|")
        const dockerPullList = []
        for( let line in COMPLETIONS){
          dockerPullList.push(COMPLETIONS[line])
        }
        for(let index in dockerPullList){
          const value = dockerPullList[index]
          suggestAllList["dockerPull.cwl"].push(
            {"value":value,"description":type_description,"type":type_type,"descriptionMoreURL":keyword_url}
          )
        }


        //
        const suggestionlist = []
        for(let i in scopes){
          const scope = scopes[i]
          if(scope in suggestAllList){
            for(let item in suggestAllList[scope]){
              suggestionlist.push(suggestAllList[scope][item])
            }
          }
        }
        return suggestionlist;
      }
    }
  }

  setCWLsSource(cwlsSource) {
    if (typeof (cwlsSource != null ? cwlsSource.cwlsForScopes : undefined) === "function") {
      return this.cwlsSource = cwlsSource
    }
  }

  getSuggestions({scopeDescriptor, prefix}) {
    if (!(prefix != null ? prefix.length : undefined)) { return }
    const scopeCWLs = this.cwlsSource.cwlsForScopes(scopeDescriptor)
    return this.findSuggestionsForPrefix(scopeCWLs, prefix)
  }

  findSuggestionsForPrefix(cwls, prefix) {
    if (cwls == null) { return [] }

    const suggestions = []
    for (let cwlPrefix in cwls) {
      const cwl = cwls[cwlPrefix]
      const keyword = cwl.value
      if (!keyword || !cwlPrefix || !prefix || !firstCharsEqual(keyword, prefix)) { continue }
      suggestions.push({
        iconHTML: this.showIcon ? undefined : false,
        type: cwl.type,
        text: keyword,
        replacementPrefix: prefix,
        // rightLabel: cwl.name,
        // rightLabelHTML: cwl.rightLabelHTML,
        // leftLabel: cwl.leftLabel,
        // leftLabelHTML: cwl.leftLabelHTML,
        description: cwl.description,
        descriptionMoreURL: cwl.descriptionMoreURL
      })
    }

    suggestions.sort(ascendingPrefixComparator)
    return suggestions
  }

  // TODO insert :(colon) after insert suggestion
  // onDidInsertSuggestion({editor}) {
  //   return atom.commands.dispatch(atom.views.getView(editor), 'snippets:expand')
  // }

}

const ascendingPrefixComparator = (a, b) => a.text.localeCompare(b.text)

const firstCharsEqual = (str1, str2) => str1[0].toLowerCase() === str2[0].toLowerCase()
