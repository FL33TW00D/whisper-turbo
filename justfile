push-hf:
    cd ~/Code/whisper-turbo/playground && npm run export
    git push space `git subtree split --prefix playground/out main`:main --force
