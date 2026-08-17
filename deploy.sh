#!/usr/bin/env bash
#
# Build and deploy Literal Storyboard.
#
#   ./deploy.sh build              install, verify and build into dist/
#   ./deploy.sh docker             build the container image
#   ./deploy.sh docker --push      ...and push it to $IMAGE_REGISTRY
#   ./deploy.sh amplify            deploy the Amplify backend + frontend
#
# Flags:
#   --push        push the image after building (docker target)
#   --skip-checks skip lint and typecheck (build target and everything above it)
#   --yes         don't prompt before anything that leaves this machine
#
# Environment:
#   VITE_OPENROUTER_API_KEY   inlined into the bundle at build time
#   IMAGE_NAME                default: literal-storyboard
#   IMAGE_TAG                 default: current git short SHA, or "latest"
#   IMAGE_REGISTRY            e.g. ghcr.io/you — required for --push
#   AWS_BRANCH / AWS_APP_ID   required for the amplify target

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

TARGET="${1:-build}"
shift || true

PUSH=false
SKIP_CHECKS=false
ASSUME_YES=false

for arg in "$@"; do
  case "$arg" in
    --push) PUSH=true ;;
    --skip-checks) SKIP_CHECKS=true ;;
    --yes|-y) ASSUME_YES=true ;;
    *) echo "Unknown flag: $arg" >&2; exit 2 ;;
  esac
done

IMAGE_NAME="${IMAGE_NAME:-literal-storyboard}"
IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD 2>/dev/null || echo latest)}"

info() { printf '\033[1;34m==>\033[0m %s\n' "$1"; }
fail() { printf '\033[1;31mError:\033[0m %s\n' "$1" >&2; exit 1; }

confirm() {
  $ASSUME_YES && return 0
  read -r -p "$1 [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]] || fail "Aborted."
}

require() {
  command -v "$1" >/dev/null 2>&1 || fail "$1 is required but not installed."
}

load_env() {
  # Only used to surface a missing key early; Vite reads .env on its own.
  if [[ -f .env ]]; then
    set -a; source .env; set +a
  fi
  if [[ -z "${VITE_OPENROUTER_API_KEY:-}" ]]; then
    echo "Note: VITE_OPENROUTER_API_KEY is not set — the build will ship with"
    echo "      bundled stories and artwork only. See .env.example."
  fi
}

do_build() {
  require node
  require npm
  load_env

  info "Installing dependencies (npm ci)"
  npm ci

  if ! $SKIP_CHECKS; then
    info "Typechecking and linting"
    npx tsc --noEmit
    npm run lint
  fi

  info "Building"
  npm run build
  info "Built into dist/"
}

do_docker() {
  require docker
  load_env

  local ref="$IMAGE_NAME:$IMAGE_TAG"
  info "Building image $ref"
  docker build \
    --build-arg "VITE_OPENROUTER_API_KEY=${VITE_OPENROUTER_API_KEY:-}" \
    -t "$ref" \
    -t "$IMAGE_NAME:latest" \
    .

  if $PUSH; then
    [[ -n "${IMAGE_REGISTRY:-}" ]] || fail "IMAGE_REGISTRY must be set to push."
    local remote="$IMAGE_REGISTRY/$IMAGE_NAME:$IMAGE_TAG"

    echo
    echo "The image contains the built bundle. If VITE_OPENROUTER_API_KEY was"
    echo "set at build time, that key is inside the image and readable by anyone"
    echo "who can pull it."
    confirm "Push $remote?"

    docker tag "$ref" "$remote"
    docker push "$remote"
    info "Pushed $remote"
  else
    info "Run it with: docker run --rm -p 6060:80 $ref"
  fi
}

do_amplify() {
  require npx
  [[ -n "${AWS_BRANCH:-}" ]] || fail "AWS_BRANCH must be set."
  [[ -n "${AWS_APP_ID:-}" ]] || fail "AWS_APP_ID must be set."

  confirm "Deploy the Amplify backend for branch '$AWS_BRANCH' (app $AWS_APP_ID)?"

  info "Deploying backend"
  npx ampx pipeline-deploy --branch "$AWS_BRANCH" --app-id "$AWS_APP_ID"

  do_build
  info "Backend deployed and frontend built into dist/"
  info "Amplify Hosting publishes dist/ from its own build step; for a manual"
  info "deploy, upload dist/ to your hosting target."
}

case "$TARGET" in
  build)   do_build ;;
  docker)  do_build; do_docker ;;
  amplify) do_amplify ;;
  -h|--help|help)
    sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
    ;;
  *) fail "Unknown target '$TARGET'. Try: build | docker | amplify | help" ;;
esac
