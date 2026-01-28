FROM public.ecr.aws/lambda/nodejs:20

# Install git for checkout
RUN yum install -y git

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set pnpm home and store to /tmp
ENV PNPM_HOME="/tmp/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Ensure pnpm stores packages in /tmp instead of the default read-only home
RUN pnpm config --global set store-dir /tmp/.pnpm-store

COPY handler.js ${LAMBDA_TASK_ROOT}

CMD [ "handler.handler" ]
