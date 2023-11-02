push-hf:
    cd ~/Code/whisper-turbo/playground/out && cp README.md ..
    cd ~/Code/whisper-turbo/playground && npm run export
    cd ~/Code/whiper-turbo/playground && cp README.md out/
    git push space `git subtree split --prefix playground/out main`:main --force
