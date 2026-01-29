FROM public.ecr.aws/lambda/nodejs:24

# Install git for checkout (AL2023 uses dnf)
RUN dnf install -y git

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set pnpm home and store to /tmp
ENV PNPM_HOME="/tmp/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Ensure pnpm stores packages in /tmp instead of the default read-only home
RUN pnpm config --global set store-dir /tmp/.pnpm-store

RUN echo "--- File Listing ---" && \
    ls -la .

COPY target/handler.js ${LAMBDA_TASK_ROOT}

CMD [ "handler.handler" ]

