DOCKER_USERNAME="nobugsme"
LOCAL_IMAGE_NAME="nbank-ui"
LOCAL_IMAGE_TAG="latest"
REMOTE_IMAGE_TAG="latest"

docker login -u ${DOCKER_USERNAME} -p dckr_pat_CsrFYBFYLZmNK0ODZVz5gppYbtk
docker tag "${LOCAL_IMAGE_NAME}:${LOCAL_IMAGE_TAG}" "${DOCKER_USERNAME}/nbank-ui:${REMOTE_IMAGE_TAG}"
docker push "${DOCKER_USERNAME}/nbank-ui:${REMOTE_IMAGE_TAG}"

